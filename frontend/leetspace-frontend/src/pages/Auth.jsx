import { useEffect } from "react";
import { useDemo } from "@/context/DemoContext";
import { LoginForm } from "@/components/login-form";

export default function Auth() {
	const { isDemo } = useDemo();
	useEffect(() => {
		if (isDemo) {
			window.location.replace("/dashboard");
		}
	}, [isDemo]);
	return <LoginForm />;
}
  