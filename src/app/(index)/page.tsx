'use client';
import { useEffect, useState } from 'react';
import { Client } from './_components/Client';
import { ClientCreatePet } from './_components/CreatePet';
import { Navbar } from './_components/Navbar';
import Cookies from 'js-cookie';
import { Loading } from '@/components/Loading';
import { useUserStore } from '@/hooks/use-user';
import { fetchRequest } from '@/utils/request';

export default function Home() {
  const { userState } = useUserStore();
  const [friendId, setFriendId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isPet, setIsPet] = useState(false);
  useEffect(() => {
    const isPet = Number(Cookies.get('isPet'));
    if (!Number.isNaN(isPet)) {
      setIsPet(isPet > 0);
      setLoading(false);

      fetchRequest('/restApi/friend/list/v2').then(({ result }) => {
        if (result.conversations.rows.length) {
          setFriendId(result.conversations.rows[0].id);
        }
      });
    }
  }, [userState]);
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : !isPet ? (
        <ClientCreatePet setFriendId={setFriendId}></ClientCreatePet>
      ) : (
        <div className="bg-black h-full flex flex-col">
          <Navbar></Navbar>

          <Client friendId={friendId}></Client>
        </div>
      )}
    </>
  );
}
