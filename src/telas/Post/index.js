import { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Touchable } from "react-native";
import { salvarPost, atualizarPost, deletarPost } from "../../servicos/firestore";
import estilos from "./estilos";
import { entradas } from "./entradas";
import { alteraDados } from "../../utils/comum";
import { IconeClicavel } from "../../componentes/IconeClicavel";
import { deletarImagem, salvarImagem } from "../../servicos/storage";
import * as ImagemPicker from 'expo-imagem-picker';

import uploadImagemPadrao from '../../assets/uploadImagemPadrao.jpeg'
import { MenuSelecaoInferior } from "../../componentes/MenuSelecaoInferior";


export default function Post({ navigation, route }) {
    const [desabilitarEnvio, setDesabilitarEnvio] = useState(false);
    const { item } = route?.params || {};

    const [imagem, setImagem] = useState(item?.imagemUrl || null);
    const [mostrarMenu, setMostrarMenu] = useState(false)

    const [post, setPost] = useState({
        titulo: item?.titulo || "",
        fonte: item?.fonte || "",
        descricao: item?.descricao || "",
        imagemUrl: item?.imagemUrl || null
    });

    async function salvar() {
        setDesabilitarEnvio(true);

        if (item) {
            await verificarAlteracaoPost()
            return  navigation.goBack();
        } 
        const idPost = await salvarPost({
            ...post,
            imagemUrl: ''
        });
        navigation.goBack()
        if(imagem !=null) {
            atualizarPostComImagem(idPost)
        }

    }

    async function atualizarPostComImagem(idPost){
        const url = await salvarImagem(imagem, idPost);
        await atualizarPost(idPost, {
            imagemUrl: url
        });
    }

    async function verificarAlteracaoPost(){
        if(post.imagemUrl != imagem){
            atualizarPostComImagem(item.id)
        }
        else {
            atualizarPost(item.id, post)
        }
    }

    async function escolherImagemDaGaleria(){
        let result = await ImagemPicker.launchImagemLibraryAsync({
            mediaTypes: ImagemPicker.
            MediaTypesOptions.ALL,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if(!result.canceled){
            setImagem(result.assets[0].uri);
        }
    }

    async function removerImagemPost(){
        if(!item) return
        if(deletarImagem(item.id)){
            await atualizarPost(item.id, {
                imagemUrl: null
            });
            navigation.goBack()
        }
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

                <TouchableOpacity 
                    style={estilos.imagem}
                    onPress={() => setMostrarMenu(true)}
                >
                    <Image 
                        source={ imagem ? { uri: imagem } : uploadImagemPadrao}
                        style={estilos.imagem} 
                    />
                </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={estilos.botao} onPress={salvar} disabled={desabilitarEnvio}>
                <Text style={estilos.textoBotao}>Salvar</Text>
            </TouchableOpacity>
            <MenuSelecaoInferior setMostrarMenu={setMostrarMenu} mostrarMenu={mostrarMenu}>
                            <TouchableOpacity style={estilos.opcao} onPress={escolherImagemDaGaleria}>
                                <Text>Adicionar Foto</Text>
                                <Text> &#128247;</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={estilos.opcao} onPress={removerImagemPost}>
                                <Text>Remover Foto</Text>
                                <Text> &#128465;</Text>
                            </TouchableOpacity>
            </MenuSelecaoInferior>
        </View>
    );
}