export async function verifyElitePassLink(uuid: string) {
  try {
    const response = await fetch("/api/verify-elite-pass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Verification failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Verification API call failed:", error);
    throw error;
  }
}
