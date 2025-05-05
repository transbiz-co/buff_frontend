import { redirect } from "next/navigation"

export default function Home() {
  // For now, we'll redirect to the sign-in page
  // In a real app, you would check if the user is authenticated
  // and redirect to the appropriate page
  redirect("/sign-in")

  // When authenticated, you would redirect to:
  // redirect("/objectives/reduce-ad-waste")
}
