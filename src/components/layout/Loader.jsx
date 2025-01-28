"use client";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/Loader.module.css";

const Loader = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    // Simulate real data fetching by waiting for the browser to load
    const handleLoad = () => setLoading(false);
    window.addEventListener("load", handleLoad);

    return () => window.removeEventListener("load", handleLoad);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div className={styles.loaderOverlay}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <Image
          src="/logo.png"
          alt="Loading..."
          width={100}
          height={100}
          className={styles.logo}
        />
      </div>
    </div>
  );
};

export default Loader;
