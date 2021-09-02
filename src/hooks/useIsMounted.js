import { useEffect, useRef } from "react"

export const useIsMounted = () => {
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, [isMounted]); // Using an empty dependency array ensures this only runs on unmount

  return isMounted
}