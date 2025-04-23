"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [id, setId] = useState<string>("");

  const openModal = useCallback((id: string) => {
    setIsOpen(true)
    setId(id);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setId("");
  }, []);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, id, openModal, closeModal, toggleModal };
};
