"use client"

import { useEffect, useState } from "react"
import { registerParticipant, validateParticipantData } from "@/backend/participant"
import { useRouter } from "next/navigation"
import Select from "react-select"
import { getAllEvents, getEventOptions } from "@/backend/events"
import type { ExtendedEvent, ExtendedParticipantCreateInput } from "@/types"

const Register = () => {
  const router = useRouter()

  const [isRegistering, setIsRegistering] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const [generalError, setGeneralError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "A J Institute of Engineering and Technology, Mangalore",
    year: 0,
    department: "",
    usn: "",
  })

  const [events, setEvents] = useState<ExtendedEvent[]>([])
  const [eventOptions, setEventOptions] = useState<any>([])
  const [selectedEvents, setSelectedEvents] = useState<any[]>([])
  const [groupEventData, setGroupEventData] = useState<any>({})

  useEffect(() => {
    ;(async () => {
      const options = await getEventOptions()
      const allEvents = await getAllEvents()
      setEventOptions(options)
      setEvents(allEvents)
    })()
  }, [])

  const handleChange = (e: any) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: id === "year" ? Number(value) : id === "usn" ? value.toUpperCase() : value,
    }))
  }

  const handleEventSelection = (selected: any) => {
    setSelectedEvents(selected)

    const newGroupData: any = {}

    selected.forEach((event: any) => {
      const eventObj = events.find((e) => e.id === event.id)

      if (eventObj?.eventType === "Team") {
        newGroupData[event.id] = {
          members: Array.from({ length: eventObj.minMembers - 1 }, () => ({
            name: "",
            usn: "",
            email: "",
          })),
        }
      }
    })

    setGroupEventData(newGroupData)
  }

  const isSoloEvent = (type: string) => {
    return type?.trim().toLowerCase() === "solo"
  }

  const calculateTotal = () => {
    return selectedEvents.reduce((sum, event) => {
      const e = events.find((ev) => ev.id === event.id)
      if (!e) return sum

      if (isSoloEvent(e.eventType)) return sum

      return sum + (e.fee || 0)
    }, 0)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsRegistering(true)
    setFormErrors({})
    setGeneralError("")

    const errors = await validateParticipantData(formData)

    if (errors && Object.keys(errors).length > 0) {
      setFormErrors(errors)
      setIsRegistering(false)
      return
    }

    if (selectedEvents.length === 0) {
      setGeneralError("Please select at least one event")
      setIsRegistering(false)
      return
    }

    const totalAmount = calculateTotal()

    const participantData: ExtendedParticipantCreateInput = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      college: formData.college,
      year: formData.year,
      department: formData.department,
      usn: formData.usn,
      transaction_ids: [],
      paymentScreenshotUrls: [],
      groupMembersData: groupEventData,
      amount: totalAmount,
    }

    const { error } = await registerParticipant(
      participantData,
      selectedEvents.map((e) => e.id)
    )

    if (error) {
      setGeneralError("Registration failed. Try again.")
      setIsRegistering(false)
      return
    }

    router.push("/registration-success")
  }

  return (
    <div className="flex justify-center min-h-screen p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">

        {/* HEADER */}
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
          🎓 AJIET Students – Only SOLO Events are FREE
        </div>

        <h2 className="text-lg font-semibold mb-4 text-center">
          AJ Registration
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* INPUTS */}
          <input id="name" placeholder="Name" onChange={handleChange} className="border p-2 rounded" required />
          <input id="email" placeholder="Email" onChange={handleChange} className="border p-2 rounded" required />
          <input id="phone" placeholder="Phone" onChange={handleChange} className="border p-2 rounded" required />
          <input id="usn" placeholder="USN" onChange={handleChange} className="border p-2 rounded" required />
          <input id="department" placeholder="Department" onChange={handleChange} className="border p-2 rounded" required />
          <input id="year" placeholder="Year" onChange={handleChange} className="border p-2 rounded" required />

          {/* EVENTS */}
          <Select
            options={eventOptions}
            isMulti
            value={selectedEvents}
            onChange={handleEventSelection}
            placeholder="Select events"
          />

          {/* SELECTED EVENTS */}
          <div className="flex flex-wrap gap-2">
            {selectedEvents.map((event) => {
              const e = events.find((ev) => ev.id === event.id)
              if (!e) return null

              const isSolo = isSoloEvent(e.eventType)

              return (
                <div key={e.id} className="bg-gray-100 px-3 py-1 rounded">
                  {e.eventName}{" "}
                  {isSolo ? (
                    <span className="text-green-600 font-medium">(Free)</span>
                  ) : (
                    <span className="text-pink-600 font-medium">₹{e.fee}</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* TOTAL */}
          <div className="text-center font-semibold">
            Total: ₹{calculateTotal()}
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isRegistering}
            className="bg-pink-700 text-white py-2 rounded"
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>

          {generalError && <p className="text-red-500 text-center">{generalError}</p>}
        </form>
      </div>
    </div>
  )
}

export default Register