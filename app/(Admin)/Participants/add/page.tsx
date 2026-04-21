"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { getAllEvents, getEventOptions } from "@/backend/events";
import { registerParticipant, validateParticipantData } from "@/backend/participant";
import { ExtendedEvent, ExtendedParticipantCreateInput } from "@/types";
import { toast } from "sonner";

export default function AdminAddParticipantPage() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string | undefined }>({});
    
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", college: "",
        year: 0, department: "", usn: "",
    });

    const [amount, setAmount] = useState<number>(0);
    const [transactionId, setTransactionId] = useState<string>("ADMIN_MANUAL_ENTRY");
    const [paymentStatus, setPaymentStatus] = useState<string>("APPROVED");

    const [events, setEvents] = useState<ExtendedEvent[]>([]);
    const [eventOptions, setEventOptions] = useState<any[]>([]);
    const [selectedEvents, setSelectedEvents] = useState<any[]>([]);
    const [groupEventData, setGroupEventData] = useState<{
        [groupId: string]: { participantCount: number; members: { name: string; usn: string; email: string }[] };
    }>({});
    
    // College List
    const colleges = [
        "A J Institute of Engineering and Technology, Mangalore",
        "Alva's Ayurveda Medical College, Moodbidri",
        "Srinivas institute of technology, valachill",
        "Alva's Homoeopathic Medical College, Moodbidri",
        "Alva's Institute of Engineering Technology, Moodbidri",
        "Alvas College of Nursing, Moodbidri",
        "The Oxford college of engineering",
        "Aloysius MBA, Mangalore",
        "Canara Engineering College, Mangalore",
        "Carmel Degree College, Modankap, BC Road",
        "St. Mary's College, Shirva",
        "adichunchanagiri institute of engineering, coorg",
        "CIT, chickmagalur",
        "Rajarajeshwari college Bangalore",
        "Shri Madhwa Vadiraja Institute of Technology and Management, Udupi",
        "Mahathma Gandhi Memorial (MGM) College, Udupi",
        "Vaikunta Baliga College of Law, Udupi",
        "Trisha Vidya College of Commerce and Management",
        "Upendra Pai Memorial College, Udupi",
        "Udupi Group of Institutions, Manipal",
        "Kasturba Medical College (KMC), Manipal",
        "Laxmi Memorial College of Nursing & Physiotherapy",
        "Manipal Institute of Technology, Manipal",
        "College of Fisheries, Mangalore",
        "Dr G Shankar Government Women's First Grade College & PG Study Centre, Ajjarkadu, Udupi",
        "Govt. First Grade College, Kaup",
        "Government Girls Degree College, Brahmagiri, Udupi",
        "Govinda Dasa College, Surathkal",
        "GTTC Baikampady, Mangalore",
        "Karavali Ayurveda and Medical Research, Mangalore",
        "Karavali College of Hotel Management",
        "Karavali College of Nursing Science",
        "Karavali College of Pharmacy, Mangalore",
        "Karavali College of Pharmacy, Vamanjoor, Mangalore",
        "Karavali College of Physiotherapy",
        "Karavali Institute of Technology, Mangalore",
        "Karavali Institute of Technology, Moodbidri",
        "KMC, Manipal",
        "Mahatma Gandhi Memorial (MGM) College, Udupi",
        "MIT Hotel Management",
        "MIT Manipal",
        "MITE - Mangalore Institute of Technology & Engineering",
        "Moodlakatte Institute of Technology, Kundapur",
        "N.M.A.M. Institute of Technology, Nitte, Karkala",
        "NITK, Surathkal",
        "Nitte Institute of Pharmacy",
        "Padua College, Mangaluru",
        "Padu Thirupathi Degree College, Karkala",
        "Poornaprajna College, Udupi",
        "Pompeii College, Aikala",
        "Sahyadri College of Engineering and Management",
        "SDM College of Engineering and Technology (SDMC)",
        "SDM Polytechnic, Ujire",
        "SDPT First Grade College, Kateel",
        "Shirdi Sai Degree College, Karkala",
        "Shri Madhwa Vadiraja Institute of Technology & Management, Bantakal",
        "Sri Bhuvanendra College, Karkala",
        "Sri Devi Institute of Technology, Kenjara, Bajpe",
        "Sri Mahaveera College, Kodangallu, Moodbidri",
        "Sri Taralabalu Jagadguru Institute of Technology",
        "Srinivas Institute of Engineering and Technology, Mukka",
        "Srinivas Institute of Engineering and Technology, valachil",
        "Srinivas Institute of Medical Sciences and Research Center, Mukka",
        "St Joseph Engineering College, Vamanjoor, Mangaluru",
        "St. Raymond's Degree College, Vamanjoor, Kudupu, Karnataka",
        "Sumedha Fashion Institute, Karkala",
        "S NM Polytechnic, Moodbidri",
        "Udupi Group of Institutions",
        "Upendra Pai Memorial College (UPMC), Kunjebettu, Udupi",
        "Yenapoya Institute of Arts Science and Commerce",
        "Muniyal Ayurveda College",
        "Vaikunta Baliga College of Law, Kunjibettu",
        "Gandhinagar First Grade College",
        "Tejaswini Group of Institutions",
        "Mangala Group of Institutions",
        "PACE Mangalore",
        "Yenepoya School Of Engineering & Technology",
        "Bearys Institute of Technology",
        "Kanachur Institute of Medical Science",
        "NITTE Architecture",
        "NITTE Nursing",
        "St Mary's College, Shirva",
        "Ids college, Mangalore",
        "Canara Degree College",
        "St Agnes College(Autonomous). Bendur, Mangaluru",
        "Besant Women's College",
        "Shree Gokarnanatheshwara College",
        "Mahatma Gandhi Memorial College, Udupi",
        "Yenepoya Allied Science",
        "NITTE Institute of Communication",
        "Unity Academy of Education, Institute of Nursing, Ashok Nagar, Mangalore",
        "Trisha College of Commerce and Management, Alake Road, Kodailbail",
        "Narayana Guru School And College, Barke Road, Kudroli",
        "Athene Institute of Health Science",
        "Athena Institute of Nursing Science",
        "Indira Institute of Nursing Science",
        "Laxmi Memorial College of Nursing",
        "St. Aloysius",
        "Ramakrishna Degree College",
        "MAPS College",
        "NITTE MBA",
        "Moti Mahal",
        "Govt. JJJ College",
        "Dr. Dayananda Pai - P Sathisha Pai Govt. First Grade College, Car Street, Mangalore",
        "AJIM",
        "M. V. Shetty College of Physiotherapy, Mangalore",
        "Trisha College of Nursing, Mangalore",
        "Shree Devi Institute of Technology, Mangalore",
        "Manel Srinivas Nayak Institute of Management, Mangalore",
        "Yenepoya Institute of Technology (YIT), Moodbidri",
        "Sahyadri College of Nursing, Mangalore",
        "A.J. Institute of Management, Mangalore",
        "A.J. Institute of Dental Sciences, Mangalore",
        "A.J. Institute of Allied Health Sciences, Mangalore",
        "A.J. Institute of Medical Sciences, Mangalore",
        "Padua College of Commerce and Management, Mangalore",
        "A.J. Institute of Nursing, Mangalore",
        "A.J. Institute of Physiotherapy, Mangalore",
        "Yenepoya Degree College, Mangalore",
        "Shridevi Institute of Computer Sciences (BCA), Mangalore",
        "Shridevi College of Nursing, Mangalore",
        "Shridevi College of Commerce (B.Com), Mangalore",
        "SDM College of Business Management (MBA), Mangalore",
        "SDM Law College, Mangalore",
        "SDM PG College Ujire",
        "SDM Institute of Technology (SDMIT) Ujire",
        "Canara College (MCA Program), Mangalore",
        "Minerva College, Mangalore",
        "Srinivas Institute of Nursing Sciences, Mangalore",
        "Srinivas College of Pharmacy, Mangalore",
        "P.A. College of Engineering, Mangalore",
        "P.A. Polytechnic, Mangalore",
        "P.A. First Grade College, Mangalore",
        "Alva's College, Moodbidri",
        "Alva's College of Law, Moodbidri",
        "Alva's College of Naturopathy and Yogic Sciences, Moodbidri",
        "Canara Engineering College (CEC), Benjanapadavu",
        "Anugraha Women's College, Kalladka",
        "Sri Rama First Grade College, Kalladka",
        "Vivekananda Degree College, Puttur",
        "Vivekananda College of Engineering & Technology, Puttur",
        "St Philomena College, Puttur",
        "St Philomena PG and Research Centre, Puttur",
        "Akshaya College, Puttur",
        "Ambika First Grade College, Puttur",
        "KVG Ayurveda College, Sulya",
        "KVG College of Engineering, Sulya",
        "KVG Dental College, Sulya",
        "BGS Institute of Technology, Bangalore",
        "Shri Shirdi Sai Mandira College, Karkala",
        "Vijaya College, Mulki",
        "Srinivas Institute of Allied Health Sciences, Mangalore",
        "BGS Institute of Technology, Mangalore",
        "Acharya Institute of Technology, Bangalore",
        "Adi Shankara Institute of Engineering Technology, Kalady",
        "Amrita Vishwa Vidyapeetham, Coimbatore",
        "Angadi Institute of Technology, Belagavi",
        "Bangalore Institute of Technology, Bangalore",
        "BMS College of Engineering, Bangalore",
        "BMS Institute of Technology and Management, Bangalore",
        "BNM Institute of Technology, Bangalore",
        "CMR Institute of Technology, Bangalore",
        "Dayananda Sagar College of Engineering, Bangalore",
        "Dr. Ambedkar Institute of Technology, Bangalore",
        "East Point College of Engineering, Bangalore",
        "Global Academy of Technology, Bangalore",
        "Gogte Institute of Technology, Belagavi",
        "HKBK College of Engineering, Bangalore",
        "KS Institute of Technology, Bangalore",
        "KLE Technological University, Hubli",
        "LBS Institute of Technology for Women, Thiruvananthapuram",
        "M S Engineering College, Bangalore",
        "MS Ramaiah Institute of Technology, Bangalore",
        "New Horizon College of Engineering, Bangalore",
        "Nitte Meenakshi Institute of Technology, Bangalore",
        "PES College of Engineering, Mandya",
        "PES University, Bangalore",
        "Poojya Doddappa Appa College of Engineering, Kalaburagi",
        "RNS Institute of Technology, Bangalore",
        "RV College of Engineering, Bangalore",
        "Sir M Visvesvaraya Institute of Technology, Bangalore",
        "SJB Institute of Technology, Bangalore",
        "SNS College of Engineering, Coimbatore",
        "Sri Jayachamarajendra College of Engineering (SJCE), Mysore",
        "Sri Ramakrishna Engineering College, Coimbatore",
        "Vidyavardhaka College of Engineering, Mysore",
        "College of Engineering Chengannur",
        "College of Engineering Trivandrum",
        "Federal Institute of Science and Technology, Angamaly",
        "Government Engineering College Adoor",
        "Government Engineering College Alappuzha",
        "Government Engineering College Attingal",
        "Government Engineering College Barton Hill, Thiruvananthapuram",
        "Government Engineering College Chavara, Kollam",
        "Government Engineering College Ernakulam",
        "Government Engineering College Idukki",
        "Government Engineering College Kanhangad",
        "Government Engineering College Kannur",
        "Government Engineering College Karunagapally",
        "Government Engineering College Kasaragod",
        "Government Engineering College Kayamkulam",
        "Government Engineering College Kollam",
        "Government Engineering College Kottarakkara",
        "Government Engineering College Kottayam",
        "Government Engineering College Kozhikode",
        "Government Engineering College Kunnamkulam",
        "Government Engineering College Malappuram",
        "Yenepoya Homoeopathic Medical College and hospital",
        "Government Engineering College Mananthavady",
        "Government Engineering College Munnar",
        "Government Engineering College Painavu",
        "Government Engineering College Palakkad",
        "Government Engineering College Pathanamthitta",
        "Government Engineering College Payyannur",
        "Government Engineering College Sreekrishnapuram",
        "Government Engineering College Thalassery",
        "Government Engineering College Thiruvananthapuram",
        "Government Engineering College Thodupuzha",
        "Government Engineering College Thrissur",
        "Government Engineering College Vadakara",
        "Government Engineering College Vatakara",
        "Government Engineering College Wayanad",
        "Ilahia College of Engineering, Muvattupuzha",
        "Jyothi Engineering College, Thrissur",
        "Mar Baselios College of Engineering, Thiruvananthapuram",
        "Model Engineering College, Kochi",
        "Mohandas College of Engineering, Thiruvananthapuram",
        "Rajagiri School of Engineering and Technology, Kochi",
        "Saintgits College of Engineering, Kottayam",
        "Sree Buddha College of Engineering, Alappuzha",
        "TKM College of Engineering, Kollam",
        "Vidya Academy of Science and Technology, Thrissur",
        "Coimbatore Institute of Technology",
        "Garden City University, Bangalore",
        "Indian Institute of Science (IISc), Bangalore",
        "Jain University, Bangalore",
        "JSS Science and Technology University, Mysuru",
        "Karpagam College of Engineering, Coimbatore",
        "Karunya Institute of Technology and Sciences, Coimbatore",
        "Kumaraguru College of Technology, Coimbatore",
        "National Institute of Engineering (NIE), Mysuru",
        "PSG College of Technology, Coimbatore",
        "Reva University, Bangalore"
    ].sort((a, b) => a.localeCompare(b));

    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const eventOptionsData = await getEventOptions();
                const eventsData = await getAllEvents();
                setEventOptions(eventOptionsData);
                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "year" ? parseInt(value) || 0 : id === "usn" ? value.toUpperCase() : value,
        }));
        if (formErrors[id]) setFormErrors((prev) => ({ ...prev, [id]: undefined }));
    };

    const handleEventSelection = (selectedOptions: any) => {
        const selected = selectedOptions || [];
        setSelectedEvents(selected);
        const selectedEventIds = selected.map((o: any) => o.id);
        const newGroupData = { ...groupEventData };
        
        selected.forEach((event: any) => {
            const eventObj = events.find((e) => e.id === event.id);
            if (eventObj && eventObj.eventType === "Team" && !newGroupData[event.id]) {
                newGroupData[event.id] = {
                    participantCount: eventObj.minMembers - 1,
                    members: Array.from({ length: eventObj.minMembers - 1 }, () => ({ name: "", usn: "", email: "" })),
                };
            }
        });
        
        Object.keys(newGroupData).forEach((groupId) => {
            if (!selectedEventIds.includes(Number(groupId))) delete newGroupData[groupId];
        });
        
        setGroupEventData(newGroupData);
        
        // Auto-calculate amount
        const newTotal = selected.reduce((sum: number, s: any) => {
            const ev = events.find((e) => e.id === s.id);
            return sum + (ev?.fee || 0);
        }, 0);
        setAmount(newTotal);
    };

    const handleParticipantCountChange = (groupId: string | number, count: number | "") => {
        const currentMembers = groupEventData[groupId]?.members || [];
        const newCount = !count ? "" : Math.max(1, count);
        if (!newCount) return setGroupEventData((prev) => ({ ...prev, [groupId]: { participantCount: 0, members: [] } }));
        
        let newMembers = [...currentMembers];
        if (newCount > currentMembers.length) {
            for (let i = currentMembers.length; i < newCount; i++) newMembers.push({ name: "", usn: "", email: "" });
        } else if (newCount < currentMembers.length) {
            newMembers = newMembers.slice(0, newCount);
        }
        
        setGroupEventData((prev) => ({ ...prev, [groupId]: { participantCount: newCount, members: newMembers } }));
    };

    const handleGroupMemberChange = (groupId: number | string, index: number, field: string, value: string) => {
        setGroupEventData((prev) => {
            const updatedMembers = [...(prev[groupId]?.members || [])];
            updatedMembers[index] = { ...updatedMembers[index], [field]: value };
            return { ...prev, [groupId]: { ...prev[groupId], members: updatedMembers } };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const errors = (await validateParticipantData(formData)) || {};
        if (selectedEvents.length === 0) errors.events = "Please select at least one event";
        
        Object.keys(groupEventData).forEach((groupId) => {
            if (selectedEvents.find((e) => e.value === groupId || e.id === parseInt(groupId))) {
                groupEventData[groupId].members.forEach((member, index) => {
                    if (!member.name) errors[`group_${groupId}_member_${index}_name`] = "Member name is required";
                    if (!member.usn) errors[`group_${groupId}_member_${index}_usn`] = "Member USN is required";
                    if (!member.email) errors[`group_${groupId}_member_${index}_email`] = "Member Email is required";
                });
            }
        });
        
        if (Object.keys(errors).length > 0) { 
            setFormErrors(errors); 
            toast.error("Please check the form for errors.");
            return; 
        }

        setIsRegistering(true);
        setFormErrors({});

        try {
            const participantData: ExtendedParticipantCreateInput = {
                ...formData,
                groupMembersData: groupEventData,
                amount: amount,
                paymentStatus: paymentStatus as any,
                transaction_ids: [transactionId],
                paymentScreenshotUrls: ["None"]
            };

            const result = await registerParticipant(
                participantData,
                selectedEvents.map((e) => e.id)
            );

            if (!result || result.error) {
                if (typeof result?.error === "object" && result.error !== null) {
                    setFormErrors(result.error);
                } else {
                    toast.error(result?.error || "Registration failed.");
                }
                setIsRegistering(false);
                return;
            }

            toast.success("Participant successfully added!");
            router.push("/Participants");
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Something went wrong. Please try again.");
            setIsRegistering(false);
        }
    };

    if (isLoading) {
        return <div className="p-8">Loading events...</div>;
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild className="cursor-pointer">
                    <Link href="/Participants">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Participants
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Participant</CardTitle>
                    <CardDescription>Manually register a participant (Payment verification and screenshots are bypassed)</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={formData.name} onChange={handleChange} required />
                                    {formErrors.name && <p className="text-sm text-red-500">{formErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                                    {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                                    {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usn">USN</Label>
                                    <Input id="usn" value={formData.usn} onChange={handleChange} required />
                                    {formErrors.usn && <p className="text-sm text-red-500">{formErrors.usn}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="year">Year of Study</Label>
                                    <Input id="year" type="number" min="1" max="10" value={formData.year || ""} onChange={handleChange} required />
                                    {formErrors.year && <p className="text-sm text-red-500">{formErrors.year}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" value={formData.department} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="college">College Name</Label>
                                    <CreatableSelect
                                        id="college"
                                        instanceId="college-select"
                                        isClearable
                                        options={colleges.map(c => ({ value: c, label: c }))}
                                        value={formData.college ? { value: formData.college, label: formData.college } : null}
                                        onChange={(selected: any) => {
                                            setFormData(prev => ({ ...prev, college: selected ? selected.value : "" }));
                                            if (formErrors.college) setFormErrors(prev => ({ ...prev, college: undefined }));
                                        }}
                                        className="text-black" // Keep standard react-select styling or force text color
                                    />
                                    {formErrors.college && <p className="text-sm text-red-500">{formErrors.college}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Event Selection</h3>
                            <div className="space-y-2">
                                <Select
                                    id="events"
                                    instanceId="events-select"
                                    options={eventOptions}
                                    isMulti
                                    value={selectedEvents}
                                    onChange={handleEventSelection}
                                    className="text-black"
                                    placeholder="Select events..."
                                />
                                {formErrors.events && <p className="text-sm text-red-500">{formErrors.events}</p>}
                            </div>

                            {selectedEvents.map((event) => {
                                if (event?.type !== "Team") return null;
                                const eventDetail = events.find((e) => e.id === event.id);
                                const groupData = groupEventData[event.id] || { participantCount: 1, members: [] };
                                const minMembers = eventDetail?.minMembers ?? 2;
                                const maxMembers = eventDetail?.maxMembers ?? 10;
                                
                                return (
                                    <div key={event.id} className="p-4 border rounded-md space-y-4 bg-muted/50 mt-4">
                                        <h4 className="font-medium text-primary">{event.label} - Team Details</h4>
                                        <div className="space-y-2">
                                            <Label>Team Members (excluding leader, requires {minMembers - 1}-{maxMembers - 1})</Label>
                                            <Input 
                                                type="number" 
                                                min={minMembers - 1} 
                                                max={maxMembers - 1} 
                                                value={groupData.participantCount || ""}
                                                onChange={(e) => handleParticipantCountChange(event.id, parseInt(e.target.value) || "")}
                                                className="w-32"
                                            />
                                        </div>
                                        
                                        <div className="space-y-4 mt-4">
                                            {groupData.members.map((member, index) => (
                                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-background">
                                                    <div className="space-y-2">
                                                        <Label>Member {index + 1} Name</Label>
                                                        <Input value={member.name} onChange={(e) => handleGroupMemberChange(event.id, index, "name", e.target.value)} />
                                                        {formErrors[`group_${event.id}_member_${index}_name`] && <p className="text-xs text-red-500">{formErrors[`group_${event.id}_member_${index}_name`]}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Member {index + 1} USN</Label>
                                                        <Input value={member.usn} onChange={(e) => handleGroupMemberChange(event.id, index, "usn", e.target.value.toUpperCase())} />
                                                        {formErrors[`group_${event.id}_member_${index}_usn`] && <p className="text-xs text-red-500">{formErrors[`group_${event.id}_member_${index}_usn`]}</p>}
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Member {index + 1} Email</Label>
                                                        <Input type="email" value={member.email} onChange={(e) => handleGroupMemberChange(event.id, index, "email", e.target.value.toLowerCase())} />
                                                        {formErrors[`group_${event.id}_member_${index}_email`] && <p className="text-xs text-red-500">{formErrors[`group_${event.id}_member_${index}_email`]}</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Payment Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="amount">Amount (₹)</Label>
                                    <Input 
                                        id="amount" 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(Number(e.target.value))} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transactionId">Transaction ID</Label>
                                    <Input 
                                        id="transactionId" 
                                        value={transactionId} 
                                        onChange={(e) => setTransactionId(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Payment Status</Label>
                                    <Select
                                        id="status"
                                        instanceId="status-select"
                                        options={[
                                            { value: "APPROVED", label: "APPROVED" },
                                            { value: "PENDING", label: "PENDING" },
                                            { value: "FAILED", label: "FAILED" }
                                        ]}
                                        value={{ value: paymentStatus, label: paymentStatus }}
                                        onChange={(s: any) => setPaymentStatus(s.value)}
                                        className="text-black"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={isRegistering}>
                                {isRegistering ? "Registering..." : "Register Participant"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
