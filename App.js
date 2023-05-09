import { useState, useEffect } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Alert } from 'react-native';
import {colors, CLEAR, ENTER, colorsToEmoji} from './src/constants'
import KeyBoard from './src/components/Keyboard'
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import * as Clipboard from 'expo-clipboard';

const NUMBER_OF_TRIES = 6;

const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
}


export default function App() {
  const word = "hello";
  const letters = word.split(''); // return array of characters 

  const [rows, setRows] = useState(new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')));
  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won, lost, playing

  useEffect(() => {
    if (curRow > 0) {
      checkGameState();
    }
  });

  const checkGameState = () => {
    if (checkIfWon() && gameState !== 'won') {
      Alert.alert("Hurray", "You won!", [{text: 'Share', onPress: shareScore}])
      setGameState('won');

    } else if (checkIfLost() && gameState != 'lost') {
      Alert.alert("Meh", "Try again tomorrow!");
      setGameState('lost');
    }
  }

    const shareScore = () => {
      const textMap = rows.map((row, i) => row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
      ).filter(row => row)
      .join('\n');
      const textToShare = `Wordle \n ${textMap}`;
      Clipboard.setString(textToShare);
      Alert.alert("Copied successfully", "Share your score on your social media");
    }
  const checkIfWon = () => {
      const row = rows[curRow - 1];
      return row.every((letter, i) => letter === letters[i]);

  };

  const checkIfLost = () => {
    return !checkIfWon() && curRow === rows.length;
  }

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }
  // rows is array of row
  // row contains empty cells

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  }

  const onKeyPressed = (key) => {
    const updatedRows = copyArray(rows);
if (gameState !== 'playing')
{
  return;
}
    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
     
      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol+1);
    }
    
    
  }

  const getAllLettersWithColor = (color) => 
  {
    return rows.flatMap((row, i) => 
    row.filter((cell,j) => getCellBGColor(i, j) === color)
    );
  }
  
  const greenCaps = getAllLettersWithColor(colors.primary);
  const yellowCaps = getAllLettersWithColor(colors.secondary);
  const greyCaps = getAllLettersWithColor(colors.darkgrey);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>

        {rows.map((row, i)=> (
          <View key={`row-${i}`} style={styles.row}>
          {row.map((letter, j) => (
          <View key={`cell-${i}-${j}`}style={[styles.cell, {borderColor: isCellActive(i, j) ? colors.grey: colors.darkgrey, backgroundColor: getCellBGColor(i, j)}]}> 
          <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
          </View>
          ))}
        </View>
      ))}
     
          
        
      </ScrollView>
      <KeyBoard onKeyPressed={onKeyPressed} 
      greenCaps={greenCaps} 
      yellowCaps={yellowCaps} 
      greyCaps={greyCaps}/>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize:32,
    fontWeight: "bold",
    letterSpacing: 7,
  },
  map: {
    alignSelf: 'stretch',
    marginVertical:20,
    height: 100,
  },
  row: {
    alignSelf: "stretch",
    flexDirection: 'row',
    justifyContent: 'center',
  }, 
  cell: {
    borderWidth:3,
    borderColor:colors.darkgrey,
    flex: 1, // divide space with siblings
    maxWidth: 70,
    aspectRatio:1, // make the cell square
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  }
});
