import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import {colors} from './src/constants'
import KeyBoard from './src/components/Keyboard'

const NUMBER_OF_TRIES = 6;

export default function App() {
  const word = "hello";
  const letters = word.split(''); // return array of characters 

  const rows = new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('a'));
  // rows is array of row
  // row contains empty cells

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>WORDLE</Text>
      <ScrollView style={styles.map}>

        {rows.map((row)=> (
          <View style={styles.row}>
          {row.map((cell) => (
          <View style={styles.cell}> 
          <Text style={styles.cellText}>{cell.toUpperCase()}</Text>
          </View>
          ))}
        </View>
      ))}
     
          
        
      </ScrollView>
      <KeyBoard />
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
