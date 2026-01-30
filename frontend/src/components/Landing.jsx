import React, { useEffect, useState } from 'react'

const API = 'http://localhost:5001'

export default function Landing() {
  const [projects, setProjects] = useState([])
  const [clients, setClients] = useState([])
  const [contact, setContact] = useState({
    fullName: '',
    email: '',
    mobile: '',
    city: '',
  })
  const [newsletterEmail, setNewsletterEmail] = useState('')

  useEffect(() => {
    fetch(`${API}/projects`)
      .then((r) => r.json())
      .then(setProjects)
    fetch(`${API}/clients`)
      .then((r) => r.json())
      .then(setClients)
  }, [])

  function submitContact(e) {
    e.preventDefault()
    fetch(`${API}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    })
      .then((r) => r.json())
      .then(() => alert('Contact submitted'))
    setContact({ fullName: '', email: '', mobile: '', city: '' })
  }

  function subscribe(e) {
    e.preventDefault()
    fetch(`${API}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newsletterEmail }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((x) => Promise.reject(x))
        return r.json()
      })
      .then(() => alert('Subscribed'))
      .catch((err) => alert(err.error || 'Subscribe failed'))
    setNewsletterEmail('')
  }

  return (
    <div className="landing">
      <section className="projects">
        <h2>Our Projects</h2>
        <div className="grid">
          {projects.map((p) => (
            <article className="card" key={p.id}>
              {p.image && (
                <img src={`http://localhost:5000${p.image}`} alt={p.name} />
              )}
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <button disabled>Read More</button>
            </article>
          ))}
        </div>
      </section>

      <section className="clients">
        <h2>Happy Clients</h2>
        <div className="grid">
          {clients.map((c) => (
            <article className="card" key={c.id}>
              {c.image && (
                <img src={`http://localhost:5000${c.image}`} alt={c.name} />
              )}
              <h3>{c.name}</h3>
              <h4>{c.designation}</h4>
              <p>{c.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact">
        <h2>Contact Us</h2>
        <form onSubmit={submitContact} className="form">
          <input
            placeholder="Full Name"
            value={contact.fullName}
            onChange={(e) =>
              setContact({ ...contact, fullName: e.target.value })
            }
            required
          />
          <input
            placeholder="Email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            required
          />
          <input
            placeholder="Mobile"
            value={contact.mobile}
            onChange={(e) => setContact({ ...contact, mobile: e.target.value })}
            required
          />
          <input
            placeholder="City"
            value={contact.city}
            onChange={(e) => setContact({ ...contact, city: e.target.value })}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="newsletter">
        <h2>Newsletter</h2>
        <form onSubmit={subscribe} className="form-inline">
          <input
            placeholder="Email address"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </div>
  )
}
