import React, { useEffect, useState, useRef } from 'react'
import { Cropper } from 'react-cropper'
import 'cropperjs/dist/cropper.css'

const API = 'http://localhost:5001'

export default function Admin() {
  const [projForm, setProjForm] = useState({
    name: '',
    description: '',
    image: null,
    preview: null,
  })
  const [clientForm, setClientForm] = useState({
    name: '',
    designation: '',
    description: '',
    image: null,
    preview: null,
  })
  const projCropperRef = useRef(null)
  const clientCropperRef = useRef(null)
  const [contacts, setContacts] = useState([])
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    fetch(`${API}/contacts`)
      .then((r) => r.json())
      .then(setContacts)
    fetch(`${API}/subscribers`)
      .then((r) => r.json())
      .then(setSubscribers)
  }, [])

  async function submitProject(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', projForm.name)
    fd.append('description', projForm.description)
    if (projForm.preview && projCropperRef.current) {
      const canvas = projCropperRef.current.getCroppedCanvas({
        width: 450,
        height: 350,
      })
      await new Promise((res) =>
        canvas.toBlob((blob) => {
          fd.append('image', blob, 'project.jpg')
          res()
        }, 'image/jpeg'),
      )
    } else if (projForm.image) {
      fd.append('image', projForm.image)
    }
    fetch(`${API}/projects`, { method: 'POST', body: fd })
      .then((r) => r.json())
      .then(() => {
        alert('Project added')
        setProjForm({ name: '', description: '', image: null, preview: null })
      })
  }

  async function submitClient(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', clientForm.name)
    fd.append('designation', clientForm.designation)
    fd.append('description', clientForm.description)
    if (clientForm.preview && clientCropperRef.current) {
      const canvas = clientCropperRef.current.getCroppedCanvas({
        width: 450,
        height: 350,
      })
      await new Promise((res) =>
        canvas.toBlob((blob) => {
          fd.append('image', blob, 'client.jpg')
          res()
        }, 'image/jpeg'),
      )
    } else if (clientForm.image) {
      fd.append('image', clientForm.image)
    }
    fetch(`${API}/clients`, { method: 'POST', body: fd })
      .then((r) => r.json())
      .then(() => {
        alert('Client added')
        setClientForm({
          name: '',
          designation: '',
          description: '',
          image: null,
          preview: null,
        })
      })
  }

  return (
    <div className="admin">
      <section className="admin-section">
        <h2>Add Project</h2>
        <form onSubmit={submitProject} className="form">
          <input
            placeholder="Project Name"
            value={projForm.name}
            onChange={(e) => setProjForm({ ...projForm, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={projForm.description}
            onChange={(e) =>
              setProjForm({ ...projForm, description: e.target.value })
            }
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0]
              if (!f) return
              const url = URL.createObjectURL(f)
              setProjForm({ ...projForm, image: f, preview: url })
            }}
          />
          {projForm.preview && (
            <Cropper
              src={projForm.preview}
              style={{ height: 250, width: '100%' }}
              // Cropper.js options
              initialAspectRatio={450 / 350}
              aspectRatio={450 / 350}
              guides={false}
              viewMode={1}
              background={false}
              responsive={true}
              autoCropArea={1}
              ref={projCropperRef}
            />
          )}
          <button type="submit">Add Project</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Add Client</h2>
        <form onSubmit={submitClient} className="form">
          <input
            placeholder="Client Name"
            value={clientForm.name}
            onChange={(e) =>
              setClientForm({ ...clientForm, name: e.target.value })
            }
            required
          />
          <input
            placeholder="Designation"
            value={clientForm.designation}
            onChange={(e) =>
              setClientForm({ ...clientForm, designation: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={clientForm.description}
            onChange={(e) =>
              setClientForm({ ...clientForm, description: e.target.value })
            }
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0]
              if (!f) return
              const url = URL.createObjectURL(f)
              setClientForm({ ...clientForm, image: f, preview: url })
            }}
          />
          {clientForm.preview && (
            <Cropper
              src={clientForm.preview}
              style={{ height: 250, width: '100%' }}
              initialAspectRatio={450 / 350}
              aspectRatio={450 / 350}
              guides={false}
              viewMode={1}
              background={false}
              responsive={true}
              autoCropArea={1}
              ref={clientCropperRef}
            />
          )}
          <button type="submit">Add Client</button>
        </form>
      </section>

      <section className="admin-section">
        <h2>Contact Form Submissions</h2>
        <div className="table">
          {contacts.map((c) => (
            <div key={c.id} className="row">
              <div>{c.fullName}</div>
              <div>{c.email}</div>
              <div>{c.mobile}</div>
              <div>{c.city}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h2>Subscribers</h2>
        <div className="table">
          {subscribers.map((s) => (
            <div key={s.id} className="row">
              {s.email}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
