<View style={styles.status}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return(
              <View style={{ 
                  backgroundColor: item.color, 
                  width: 370,
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 50,
                  alignContent: 'space-around',
                  marginBottom: 10,
                  border: 100,  
                }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Icon name={item.icon} size={20} style={{ marginRight: 5, marginLeft: 6 }} />
                  <Text style={styles.title}>{item.title}</Text>
                </View>
                <View style={ { flex: 1, flexDirection: 'row', alignSelf: 'center', justifyContent: 'center'} }>
                  <View>
                    <Text>{item.qtd}</Text>
                  </View>
                  <Text>/</Text>
                  <View>
                    <Text>{item.qtdMax}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row-reverse', marginRight: 6 }}>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusTen(item.title, item.id)}>
                  <Icon name='plus-box-multiple' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => PlusOne(item.title, item.id)}>
                  <Icon name='plus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusOne(item.title, item.id)}>
                  <Icon name='minus-box' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center',  marginRight: 3  }} onPress={() => MinusTen(item.title, item.id)}>
                  <Icon name='minus-box-multiple' size={20} style={{ marginRight: 5, marginLeft: 5 }} />
                  </TouchableOpacity>
                </View>
              </View>
            )}}
        />
      </View>