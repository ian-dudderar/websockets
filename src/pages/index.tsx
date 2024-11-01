"use client";
import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io();

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [time, setTime] = useState("N/A");
  const [message, setMessage] = useState("N/A");

  useEffect(() => {
    // if (socket.connected) {
    //   onConnect();
    // }

    function onConnect() {
      setIsConnected(true);

      console.log("connected");

      socket.emit("hello", "world");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    socket.on("connect", onConnect);

    socket.on("update", (arg) => {
      console.log("updatE: ");
      setMessage(arg);
    });
    socket.on("time", (arg) => {
      setTime(arg);
    });
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  function onClick() {
    fetch("/api/test");
  }

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Time: {time}</p>
      <p>Message: {message}</p>
      <button onClick={onClick}>click me</button>
    </div>
  );
}
