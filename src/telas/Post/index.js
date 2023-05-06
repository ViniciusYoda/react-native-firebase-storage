import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { salvarPost, atualizarPost, deletarPost } from "../../servicos/firestore";
import estilos from "./estilos";
import { entradas } from "./entradas";
import { alteraDados } from "../../utils/comum";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import { salvarImagem } from "../../servicos/storage";

const imagemGalaxia = 'https://img.freepik.com/fotos-gratis/fundo-de-galaxia-espacial_53876-93121.jpg?w=740&t=st=1683392363~exp=1683392963~hmac=5ca077e09974f616ee2e20693f22369e9e16410c6245d28da9e03ef6255f022a'


export default function Post({ navigation, route }) {
    const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
    const { item } = route?.params || {};

    const [post, setPost] = useState({
        titulo: item?.titulo || "",
        fonte: item?.fonte || "",
        descricao: item?.descricao || "",
        imagemUrl: item?.imagemUrl || null
    });

    async function salvar() {
        setDesabilitarEnvio(true);

        const url = await salvarImagem(imagemGalaxia, 'galaxia');

        if (item) {
            await atualizarPost(item.id, post);
        } else {
            await salvarPost({...post, imagemUrl: url});
        }
        
        navigation.goBack();
    }



    return (
        <View style={estilos.container}>
            <View style={estilos.containerTitulo}>
                <Text style={estilos.titulo}>{item ? "Editar post" : "Novo Post"}</Text>
                <IconeClicavel 
                    exibir={!!item} 
                    onPress={() => {deletarPost(item.id); navigation.goBack()}}
                    iconeNome="trash-2" 
                />
            </View>
            <ScrollView style={{ width: "100%" }}>
                {entradas?.map((entrada) => (
                    <View key={entrada.id}>
                        <Text style={estilos.texto}>{entrada.label}</Text>
                        <TextInput
                            value={post[entrada.name]}
                            placeholder={entrada.label}
                            multiline={entrada.multiline}
                            onChangeText={(valor) => 
                                alteraDados(
                                    entrada.name, 
                                    valor, 
                                    post, 
                                    setPost
                                )
                            }
                            style={
                                [estilos.entrada, entrada.multiline && estilos.entradaDescricao]
                            }
                        />
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={estilos.botao} onPress={salvar} disabled={desabilitarEnvio}>
                <Text style={estilos.textoBotao}>Salvar</Text>
            </TouchableOpacity>
        </View>
    );
}