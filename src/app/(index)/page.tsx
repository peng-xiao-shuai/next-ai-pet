'use client';
import { useEffect, useState } from 'react';
import { Client } from './_components/Client';
import { ClientCreatePet } from './_components/CreatePet';
import { Navbar } from './_components/Navbar';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/hooks/use-user';

export default function Home() {
  const { userState } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [isPet, setIsPet] = useState(false);
  useEffect(() => {
    const isPet = Number(Cookies.get('isPet'));
    if (!Number.isNaN(isPet)) {
      setIsPet(isPet > 0);
      setLoading(false);
    }
  }, [userState]);

  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : !isPet ? (
        <ClientCreatePet></ClientCreatePet>
      ) : (
        <div className="bg-black">
          <Navbar></Navbar>

          <Client></Client>
        </div>
      )}
    </>
  );
}
