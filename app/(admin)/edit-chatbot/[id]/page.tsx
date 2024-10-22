'use client'
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { BASE_URL } from "@/graphql/apolloClient"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"
import Avatar from "@/components/Avatar"
import { useMutation, useQuery } from "@apollo/client"
import { GetChatbotByIdResponse, GetChatbotByIdVariables } from "@/types/types"
import { GET_CHATBOT_BY_ID } from "@/graphql/queries/queries"
import Characteristic from "@/components/Characteristic"
import { ADD_CHARCTERISTIC, DELETE_CHATBOT, UPDATE_CHATBOT } from "@/graphql/mutations/mutations"
import { redirect } from "next/navigation"

function EditChatbot({ params : { id }}: {params : {id: string}}) {
 const [url, setUrl] = useState<string>("");
 const [chatbotName, setChatbotName] = useState<string>("");
 const [newCharacteristic, setNewCharacteristic] = useState<string>("");
 const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
  refetchQueries: ["GetChatbotById"],
  awaitRefetchQueries: true,
 });
 const [addCharacteristic] = useMutation(ADD_CHARCTERISTIC, {
  refetchQueries: ["GetChatbotById"],
 });

 const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
  refetchQueries: ["GetChatbotById"],
 })

 const {data, loading, error} = useQuery<GetChatbotByIdResponse, GetChatbotByIdVariables>(
  GET_CHATBOT_BY_ID,
{ variables: { id }} );

useEffect(() => {
  if (data){
    setChatbotName(data.chatbots.name)
  }
}, [data])
 
 useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;
    setUrl(url);
 },[id]);

 const handleAddCharacteristic = async (content: string) => {
  try {
    const promise = addCharacteristic ({
        variables: {
          chatbotId: Number(id),
          content,
        },
    });
    toast.promise(promise, {
      loading: "Adding",
      success: "Info added",
      error: "Failed to add info",
    });
  }
  catch (err){
    console.error("Failed to add characteristic", err);
  }
 };
 const handleUpdateChatbot = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const promise = updateChatbot({
      variables: {
        id,
        name: chatbotName,
      },

  });
    toast.promise(promise, {
      loading: "Updating",
      success: "Chatbot name updated",
      error: "Failed to update name",
    });
  }
  catch (err) {
    console.error("Failed to update chatbot name",err);
  }
 };

 const handleDelete = async (id: string) => {
  const isConfirmed = window.confirm(
    "Are you sure you wanna del this chatbot?"

  );
  if (!isConfirmed) return;

  try {
    const promise = deleteChatbot({ variables: { id }});
    toast.promise(promise, {
      loading: "Deleting..",
      success: "chatbot deleted",
      error: "Failed to delete chatbot",
    });
  }
  catch (error) {
    console.error("Error deleting chatbot", error);
    toast.error("Failed to delete chatbot");
  }

 };
 if (loading)
  return (
<div className="mx-auto animate-spin p-10">
  <Avatar seed="loading avatr" />
</div>
);
if (error)  return <p>Error: {error.message}</p>

if (!data?.chatbots) return redirect("/view-chatbots");
  return (
    <div className="px-0 md:p-10">
      <div className="md:sticky md:top-0 z-50 sm:max-w-sm ml-auto
      space-y-2 md:border p-5 rounded-b-lg md:rounded-lg
      bg-[#2991EE]">
        <h2 className="text-white text-sm font-bold"> Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start conversations
          with your chatbot
        </p>
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer
          hover:opacity-50">
            <Input value={url} readOnly className="bg-white cursor-pointer"/>

          </Link>
          <Button
          size="sm"
          className="px-3"
          onClick={() => {
            navigator.clipboard.writeText(url);
            toast.success("Copied to Clipboard");
          }}
          >
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <section className="relative mt-5 bg-white p-5 md:p-10 rounded-lg">
        <Button variant="destructive"
        className="absolute top-2 right-2 h-8 w-2"
        onClick={() => handleDelete(id)}
        >
          X
        </Button>
        <div className="flex space-x-4">
          <Avatar seed={chatbotName} />
          <form 
          onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
          >
            <Input
              value = {chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chatbotName}
              className="w-full border-none bg-transparent text-xl
              font-bold"
              required
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>
        <h2 className="text-xl font-bold mt-10">
          Heres what your AI knows
        </h2>
        <p>
          Your chatbot has following info
        </p>
        <div className="bg-gray-200 p-5 md:p-5 rounded-md mt-5">
          <form onSubmit={e => {
            e.preventDefault();
            handleAddCharacteristic(newCharacteristic);
            setNewCharacteristic("");
          }}
          className="flex space-x-2 mb-5"
          >
            <Input 
              type="text"
              placeholder="Example: If customer asks for prices, provide pricing page:
              www.example.com/pricing"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>
          <ul className="flex flex-wrap-reverse gap-5">
           {
            data?.chatbots?.chatbot_characteristics?.map(
              (characteristic) => (
                <Characteristic 
                key={characteristic.id}
                characteristic={characteristic}
                />
              )
            )
           }
          </ul>
        </div>
      </section>
    </div>
  )
}

export default EditChatbot
