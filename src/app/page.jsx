import { redirect } from "next/navigation";

// "/" has no content of its own; send everyone to the product list.
// (The proxy sends logged-out users to /login before this even runs.)
export default function Home() {
  redirect("/products");
}
