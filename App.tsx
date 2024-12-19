import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, Modal, TextInput, Button, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import CheckBox from 'expo-checkbox';
import uuid from 'react-native-uuid';

interface Song {
  id: string;
  title: string;
}

interface Playlist {
  id: string;
  title: string;
  songs: string[];
}

const data = [
  { label: 'Songs', value: 'Songs' },
  { label: 'Playlists', value: 'Playlists' },
];

const initialSongs: Song[] = [];
const initialPlaylists: Playlist[] = [];

const generateEmptySlots = (data: any[], totalSlots: number): any[] => {
  const emptySlots = totalSlots - data.length;
  for (let i = 0; i < emptySlots; i++) {
    data.push({ id: `empty-${uuid.v4()}`, title: '' });
  }
  return data;
};

export default function App() {
  const [selectedValue, setSelectedValue] = useState<string>("Songs");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>("");
  const [songTitle, setSongTitle] = useState<string>("");
  const [playlistTitle, setPlaylistTitle] = useState<string>("");
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [songs, setSongs] = useState<Song[]>(generateEmptySlots([...initialSongs], 10));
  const [playlists, setPlaylists] = useState<Playlist[]>(generateEmptySlots([...initialPlaylists], 10));

  const renderItem = ({ item }: { item: { label: string; value: string } }) => (
    <TouchableOpacity
      style={[styles.item, selectedValue === item.value && styles.selectedItem]}
      onPress={() => setSelectedValue(item.value)}
    >
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const handleButtonPress = () => {
    // Reset the input fields
    setFilePath("");
    setSongTitle("");
    setPlaylistTitle("");
    setSelectedSongs([]);
    setModalVisible(true);
  };

  const handlePlaylistSubmit = () => {
    console.log(`Playlist title entered: ${playlistTitle}`);
    console.log(`Selected songs: ${selectedSongs}`);
    setModalVisible(false);
    // Append to list of playlists:
    setPlaylists([...playlists.filter(playlist => playlist.title !== ''), { id: uuid.v4(), title: playlistTitle, songs: selectedSongs }]);
  };

  const renderListItem = ({ item }: { item: Song | Playlist }) => (
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.title}</Text>
    </View>
  );

  const renderSongSelectionItem = ({ item }: { item: Song }) => (
    <View style={styles.listItem}>
      <CheckBox
        value={selectedSongs.includes(item.id)}
        onValueChange={(newValue) => {
          if (newValue) {
            setSelectedSongs([...selectedSongs, item.id]);
          } else {
            setSelectedSongs(selectedSongs.filter(id => id !== item.id));
          }
        }}
      />
      <Text style={styles.listItemText}>{item.title}</Text>
    </View>
  );

  const getListData = () => {
    const listData = selectedValue === 'Songs' ? songs : playlists;
    return generateEmptySlots(listData, 10); // Adjust the totalSlots value as needed
  };

  const pickDocument = async () => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: 'audio/mpeg',
      });
      console.log(result); // Debugging log
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log(`MIME type: ${asset.mimeType}`); // Debugging log
        if (asset.mimeType === 'audio/mpeg') {
          setFilePath(asset.uri);
          const title = songTitle.trim() === "" ? asset.name : songTitle;
          console.log(`File selected: ${asset.uri}, ${title}`); // Debugging log
          // Automatically add the song to the list using the song title from the input field or the file name
          setSongs([...songs.filter(song => song.title !== ''), { id: uuid.v4(), title }]);
          setModalVisible(false);
        } else {
          alert('Please select a valid .mp3 file.');
        }
      } else {
        console.log('File selection was canceled.');
        alert('File selection was canceled.');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      alert('An error occurred while selecting the file.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
      <View style={styles.listContainer}>
        <FlatList
          data={getListData()}
          renderItem={renderListItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                {selectedValue === 'Songs' ? (
                  <>
                    <Text style={styles.modalText}>Enter Song Title:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter song title"
                      value={songTitle}
                      onChangeText={setSongTitle}
                    />
                    <Button title="Browse" onPress={pickDocument} />
                  </>
                ) : (
                  <>
                    <Text style={styles.modalText}>Enter Playlist Title:</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="Enter playlist title"
                      value={playlistTitle}
                      onChangeText={setPlaylistTitle}
                    />
                    <Text style={styles.modalText}>Select Songs:</Text>
                    <FlatList
                      data={songs.filter(song => song.title !== '')}
                      renderItem={renderSongSelectionItem}
                      keyExtractor={(item) => item.id}
                      style={styles.list}
                    />
                    <Button title="Done" onPress={handlePlaylistSubmit} />
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  pickerContainer: {
    height: 42,
    justifyContent: 'center',
    marginTop: 60, // Adjust this value to ensure the picker is positioned correctly
  },
  item: {
    width: 90,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedItem: {
    backgroundColor: 'honeydew',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
    fontFamily: 'Times New Roman',
  },
  button: {
    position: 'absolute',
    top: 20,
    left: 315,
  },
  buttonText: {
    fontSize: 47,
    color: 'black',
    fontFamily: 'Times New Roman',
  },
  listContainer: {
    flex: 1,
    width: '100%',
    marginTop: 20, // Adjust this value to start the list higher up
  },
  list: {
    flex: 1,
    width: '100%',
  },
  listItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
});