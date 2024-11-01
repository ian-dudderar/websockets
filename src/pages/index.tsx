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
  const [transport, setTransport] = useState("N/A");
  const [time, setTime] = useState("N/A");

  useEffect(() => {
    // if (socket.connected) {
    //   onConnect();
    // }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
      console.log("connected");

      socket.emit("hello", "world");
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
      console.log("disconnected");
    }

    socket.on("connect", onConnect);

    socket.on("time", (arg) => {
      console.log(arg);
      setTime(arg);
    });
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div>
      <p>Status: {isConnected ? "connected" : "disconnected"}</p>
      <p>Time: {time}</p>
    </div>
  );
}
