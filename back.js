<View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: "Righteous_400Regular", fontSize: 20, color: '#212125' }} >
          Status de personagem
        </Text>
      </View>
      <View style={{ marginLeft: 15, marginRight: 15, marginTop: 10, marginBottom: 25 }}> 
        <View style={{ flexDirection:'row', justifyContent: 'space-evenly', marginBottom: 10 }}>
          <View style={{ 
            backgroundColor: '#ee272c', 
            width: 120,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 50,
            marginRight: 10,
            borderWidth: 1
          }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginRight: 5 }}>
              <Icon name='heart' size={20} style={{ color: 'black' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Text>{data[0].qtd}/{data[0].qtdMax}</Text>
            </View>
          </View>
          <View style={{ 
              backgroundColor: '#3CB371', 
              width: 120,
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              borderWidth: 1
            }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }}>
              <Icon name='cash' size={20} style={{ color: 'black' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Text>{data[1].qtd}/{data[1].qtdMax}</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection:'row', justifyContent: 'space-evenly' }}>
          <View style={{ 
            backgroundColor: '#20B2AA', 
            width: 120,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 50,
            marginRight: 10,
            borderWidth: 1
          }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name='brain' size={20} style={{ color: 'black' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Text>{data[2].qtd}/{data[2].qtdMax}</Text>
            </View>
          </View>
          <View style={{ 
              backgroundColor: '#7B68EE', 
              width: 120,
              height: 40,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              borderWidth: 1
            }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name='water' size={20} style={{ color: 'black' }} />
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <Text>{data[3].qtd}/{data[3].qtdMax}</Text>
            </View>
          </View>
        </View>
      </View>