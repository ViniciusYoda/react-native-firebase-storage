import { storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL }  from "firebase/storage";

export async function salvarImagem(imagem,imagemNome){
   if(!imagem) return;
   const donwloadImagem = await fetch(imagem)
   const blobImagem = await donwloadImagem.blob()

   const imagemRef = ref(storage, `posts/${imagemNome}.png`)

   try {
      await uploadBytes(imagemRef, blobImagem);
      const url = await getDownloadURL(imagemRef);
      return url;
   }
   catch(error){
      console.log(error)
      return null
   }
}