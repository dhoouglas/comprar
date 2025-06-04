import { useState, useEffect } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Alert,
} from "react-native";

import { styles } from "./styles";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Filter } from "@/components/Filter";
import { FilterStatus } from "@/@types/FilterStatus";
import { Item } from "@/components/Item";
import { itemsStorage, ItemStorage } from "@/storage/itemsStorage";

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];

export function Home() {
  const [filter, setFilter] = useState(FilterStatus.PENDING);
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<ItemStorage[]>([]);

  async function handleAddItem() {
    if (!description.trim()) {
      return Alert.alert("Adicionar", "Informe a descrição para adicionar");
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING,
    };

    await itemsStorage.add(newItem);
    await itemsByStatus();

    Alert.alert("Adicionado", `Adicionado ${description}`);
    setFilter(FilterStatus.PENDING);
    setDescription("");
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter);
      setItems(response);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Nao foi possivel filtrar os itens");
    }
  }

  async function handleRemove(id: string) {
    try {
      await itemsStorage.remove(id);
      await itemsByStatus();
    } catch (error) {
      console.log(error);
      Alert.alert("Remover", "Nao foi possivel remover.");
    }
  }

  useEffect(() => {
    itemsByStatus();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require("@/assets/logo.png")} />

      <View style={styles.form}>
        <Input
          placeholder="O que você precisa comprar ?"
          onChangeText={setDescription}
          value={description}
        />
        <Button title="Adicionar" onPress={handleAddItem} />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={filter === status}
              onPress={() => setFilter(status)}
            />
          ))}

          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onStatus={() => console.log("Alterar status")}
              onRemove={() => handleRemove(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nehum item aqui</Text>
          )}
        />
      </View>
    </View>
  );
}
