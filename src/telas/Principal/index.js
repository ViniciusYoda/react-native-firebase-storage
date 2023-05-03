import { View, ScrollView, Image } from "react-native";
import { useEffect, useState } from "react";
import { Cabecalho } from "../../componentes/Cabecalho";
import { CartaoInfo } from "../../componentes/CartaoInfo";
import { NovoPostBotao } from "../../componentes/NovoPostBotao";
import { pegarPostsTempoReal } from "../../servicos/firestore";
import estilos from "./estilos";
import { storage } from "../../config/firebase";
import { ref, getDownloadURL }  from 'firebase/storage'

export default function Principal({ navigation }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const imagemRef = ref(storage, 'img4.png')

        getDownloadURL(imagemRef).then((url) => {
            console.log(url)
        })

        pegarPostsTempoReal(setPosts);
    },[])

    return (
        <View style={estilos.container}>
            <Cabecalho />
            <Image
            
            source={{uri: ''}}
            style={{}}
            />
            <ScrollView style={estilos.scroll} showsVerticalScrollIndicator={false}>

                {posts?.map((item) => (
                    <CartaoInfo 
                        key={item.id} 
                        titulo={item.titulo}  
                        fonte={item.fonte} 
                        descricao={item.descricao} 
                        acao={() => navigation.navigate("Post", { item })}
                    />
                ))}
            </ScrollView>

            <NovoPostBotao acao={() => navigation.navigate("Post")} />
        </View>
    );
}
