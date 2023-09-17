import {View, Text} from 'react-native'

export default () => {
    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 18, color: '#383838'}}>Swipe Cards</Text>
            <Text style={{fontWeight: '500', fontSize: 14, color: '#adadad'}}>Para implementarlo sigan el vídeo tutorial es muy sencillo.</Text>
            <Text style={{fontWeight: '500', fontSize: 12, color: '#adadad'}}>https://www.youtube.com/watch?v=rmp1Wf0gjo4&t=107s</Text>
        </View>
    )
}