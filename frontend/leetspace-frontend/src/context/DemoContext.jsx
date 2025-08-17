import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DemoContext = createContext({ isDemo: false, setDemo: () => {} });

export const DemoProvider = ({ children }) => {
	const [isDemo, setIsDemo] = useState(false);

	useEffect(() => {
		const saved = sessionStorage.getItem("leetspace_demo_mode");
		setIsDemo(saved === "1");
	}, []);

	const setDemo = (on) => {
		setIsDemo(!!on);
		sessionStorage.setItem("leetspace_demo_mode", on ? "1" : "0");
	};

	const value = useMemo(() => ({ isDemo, setDemo }), [isDemo]);
	return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = () => useContext(DemoContext);