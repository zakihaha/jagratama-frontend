"use client";
import { useState, useCallback } from "react";

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [id, setId] = useState<number>(0);

  const openModal = useCallback((id: number) => {
    setIsOpen(true)
    setId(id);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false)
    setId(0);
  }, []);

  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, id, openModal, closeModal, toggleModal };
};
