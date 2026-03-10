"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { registerParticipant, validateParticipantData } from "@/backend/participant"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import Select from "react-select"
import { getAllEvents, getEventOptions } from "@/backend/events"
import type { CartEvents, ExtendedEvent, ExtendedParticipantCreateInput } from "@/types"
import type { eventType } from "@prisma/client"
import { Montserrat } from "next/font/google"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const Register = () => {
  const router = useRouter()

  const [isRegistering, setIsRegistering] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({})
  const [generalError, setGeneralError] = useState("")

  const [totalAmount, setTotalAmount] = useState(0)
  const [paymentStep, setPaymentStep] = useState<"details" | "verification">("details")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "A J Institute of Engineering and Technology, Mangalore",
    year: 0,
    department: "",
    usn: "",
    transactionId: "AJIET2025",
    paymentScreenshot: "NONE",
  })

  const [events, setEvents] = useState<ExtendedEvent[]>([])
  const [eventOptions, setEventOptions] =
    useState<Awaited<ReturnType<typeof getEventOptions>>>([])

  const [selectedEvents, setSelectedEvents] = useState<
    { value: string; label: string; type: eventType; id: number }[]
  >([])

  const [groupEventData, setGroupEventData] = useState<{
    [groupId: string]: {
      participantCount: number
      members: { name: string; usn: string; email: string }[]
    }
  }>({})

  const [cartEvents, setCartEvents] = useState<CartEvents>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        const [options, eventsData] = await Promise.all([
          getEventOptions(),
          getAllEvents(),
        ])

        setEventOptions(options)
        setEvents(eventsData)

        const cartData = localStorage.getItem("eventCart")

        if (cartData) {
          const parsedCart = JSON.parse(cartData) as CartEvents
          setCartEvents(parsedCart)

          const preSelected = parsedCart
            .map((id) => {
              const event = eventsData.find((e) => e.id === id)
              if (!event) return null

              return {
                value: event.id.toString(),
                label: event.eventName,
                type: event.eventType,
                id: event.id,
              }
            })
            .filter(Boolean)

          setSelectedEvents(preSelected as any)
        }
      } catch (error) {
        console.error("Error loading events:", error)
      }

      setIsLoading(false)
    }

    loadData()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [id]: id === "year" ? Number.parseInt(value) : id === "usn" ? value.toUpperCase() : value,
    }))
  }

  const handleEventSelection = (selectedOptions: any) => {
    setSelectedEvents(selectedOptions)

    const amount = selectedOptions.reduce((sum: number, event: any) => {
      const eventObj = events.find((e) => e.id === event.id)
      return sum + (eventObj?.fee || 0)
    }, 0)

    setTotalAmount(amount)
  }

  const proceedToPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const errors = (await validateParticipantData(formData)) || {}

    if (selectedEvents.length === 0) {
      errors.events = "Please select at least one event"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setPaymentStep("verification")
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsRegistering(true)
    setFormErrors({})
    setGeneralError("")

    try {
      const participantData: ExtendedParticipantCreateInput = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        year: formData.year,
        department: formData.department,
        usn: formData.usn.toUpperCase(),
        transaction_ids: [formData.transactionId],
        paymentScreenshotUrls: ["None"],
        groupMembersData: groupEventData,
        amount: totalAmount,
      }

      const { error } = await registerParticipant(
        participantData,
        selectedEvents.map((e) => e.id)
      )

      if (error) {
        setIsRegistering(false)

        if (typeof error === "object") setFormErrors(error)
        else setGeneralError(error)

        return
      }

      router.push("/registration-success")
      router.refresh()
    } catch (error) {
      console.error(error)
      setGeneralError("Registration failed.")
      setIsRegistering(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Skeleton className="h-40 w-96" />
      </div>
    )
  }

  return (
    <div className="flex justify-center min-h-screen py-10">
      <div className="bg-white shadow-md p-6 rounded w-full max-w-3xl">

        <h2 className="text-xl font-semibold text-center mb-6">
          {paymentStep === "details" ? "Register" : "Verify Details"}
        </h2>

        {generalError && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
            {generalError}
          </div>
        )}

        {paymentStep === "details" && (
          <form className="flex flex-col gap-4" onSubmit={proceedToPayment}>

            <input
              id="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              id="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <Select
              options={eventOptions}
              isMulti
              value={selectedEvents}
              onChange={handleEventSelection}
              placeholder="Select events..."
              className={`${montserrat.className}`}
            />

            <div className="text-center mt-4 font-semibold">
              Total: ₹{totalAmount}
            </div>

            <button className="bg-pink-700 text-white py-2 rounded">
              Proceed to verification
            </button>

          </form>
        )}

        {paymentStep === "verification" && (
          <form onSubmit={handleSubmit}>

            <div className="mb-6">
              <p className="font-medium">{formData.name}</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>

            <div className="mb-6">
              {selectedEvents.map((e) => (
                <div key={e.id} className="text-sm">
                  {e.label}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">

              <button
                type="button"
                onClick={() => setPaymentStep("details")}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isRegistering}
                className="bg-pink-700 text-white px-4 py-2 rounded"
              >
                {isRegistering ? "Registering..." : "Complete Registration"}
              </button>

            </div>

          </form>
        )}
      </div>
    </div>
  )
}

export default Register