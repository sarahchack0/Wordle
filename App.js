import { useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {colors, CLEAR, ENTER} from './src/constants'
import KeyBoard from './src/components/Keyboard'

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

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  }
  // rows is array of row
  // row contains empty cells

  const getCellBGColor = (letter, row, col) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>

        {rows.map((row, i)=> (
          <View key={`row-${i}`} style={styles.row}>
          {row.map((letter, j) => (
          <View key={`cell-${i}-${j}`}style={[styles.cell, {borderColor: isCellActive(i, j) ? colors.grey: colors.darkgrey, backgroundColor: getCellBGColor(letter, i, j)}]}> 
          <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
          </View>
          ))}
        </View>
      ))}
     
          
        
      </ScrollView>
      <KeyBoard onKeyPressed={onKeyPressed}/>
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
