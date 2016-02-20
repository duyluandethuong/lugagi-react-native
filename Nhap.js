<React.NavigatorIOS
            ref="nav"
            style={styles.container}
            tintColor='#FF5252'
            initialRoute={{
              title: 'Trang chủ',
              component: LugagiHome, 
              translucent: true,
              rightButtonTitle: 'Tài khoản',
              onRightButtonPress: () => this.navigatorRightButtonPress(),
            }}/>

            
          <Navigation initialRoute={{id: 'LugagiHome'}}/>