import { useEffect, useState } from "react"
import { social } from "../data/social"
import DevTreeInput from "../components/DevTreeInput";
import { isValidUrl } from "../utils";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/DevTreeAPI";
import { User, SocialNetwork } from "../types";

const LinkTreeView = () => {
    const [treeLinks, setTreeLinks] = useState(social);

    const queryClient = useQueryClient();
    const user:User = queryClient.getQueryData(['user'])!
    
    const { mutate } = useMutation({
        mutationFn: updateProfile,
        onError: (error)=>{
            toast.error(error.message);
        },
        onSuccess: ()=>{
            toast.success('Direcciones URL actualizadas!');
        }
    })

    useEffect(()=>{
        const updatedData = treeLinks.map( item => {
            const userLink = JSON.parse(user.links).find((link: SocialNetwork)=>link.name === item.name)
            if(userLink){
                return {...item, url: userLink.url, enabled: userLink.enabled}
            }
            return item
        })
        setTreeLinks(updatedData)
    },[])

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const updatedLinks = treeLinks.map(link=>{
            if(link.name === e.target.name){
                return {...link, url: e.target.value}
            }
            return link
        })
        setTreeLinks(updatedLinks)
        queryClient.setQueryData(['user'], (prevData:User)=>{ 
            return {
                ...prevData, 
                links: JSON.stringify(updatedLinks)
            }
        })
    }

    const handleEnableLink = (socialNetwork: string)=>{
        const updatedLinks = treeLinks.map(link => {
            if(link.name === socialNetwork){
                if(isValidUrl(link.url)){
                    return {...link, enabled: !link.enabled}
                } else {
                    toast.error("Url No Valida")
                }
            }
            return link  
        })
        setTreeLinks(updatedLinks);

        queryClient.setQueryData(['user'], (prevData:User)=>{ 
            return {
                ...prevData, 
                links: JSON.stringify(updatedLinks)
            }
        })
    }
    return (
        <>
            <div className="space-y-5">
                {treeLinks.map( item =>(
                   <DevTreeInput 
                    key={item.name}
                    item={item}
                    handleUrlChange={handleUrlChange}
                    handleEnableLink={handleEnableLink}
                   /> 
                ))}
            </div>
            <button 
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 font-bold"
                onClick={()=>mutate(user)}
            >Guardar Cambios</button>
        </>
    )
}

export default LinkTreeView