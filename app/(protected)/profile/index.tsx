import { Txt } from "@/components/ui/text";
import WishlistCard from "@/components/wishlist-card";
import { api } from "@/lib/api";
import { User } from "@/types/User";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

export default function ProfileScreen() {
  const [isFetching, setIsFetching] = useState(false);
  const [user, setUser] = useState<User>({} as User);
  const { colors } = useTheme();

  async function refreshProfileData() {
    setIsFetching(true);
    const response = await api.get<User>("/users/me")
    
    if(response.status !== 200) {
      console.log("Error Retrive User", response.data);
    } 
    
    console.log(response.data);
    setUser(response.data);
    setIsFetching(false);
  }

  useEffect(() => {
    refreshProfileData();
  }, [])

  if(isFetching) {
    return <ActivityIndicator size="large" />
  }
  
  return (
    <ProfilePage>
        <Header>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.icon} />
          <Txt text="Profile" weight="bold" size={18}/>       
          <MaterialCommunityIcons name="cog" size={22} color={colors.icon} />
        </Header>

        {user && <ProfileResume>
            <Avatar source={user.image} />
            <Txt text={user.name} weight="semi" size={18} />
            <Txt text={user.email} />
            {user?.wishlists && <WishlistsContainer>
              {user.wishlists.map((item) => (
                <WishlistCard wishlist={item} onClick={() => {}} key={item.id} width="48"/>
              ))}
            </WishlistsContainer>}
        </ProfileResume>}
    </ProfilePage>
  );
}

const ProfilePage = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 24px 0px;
`;

const Header = styled.View`
  padding: 0px 24px;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  height: 30px;
`;

const ProfileResume = styled.View`
  flex-direction: column;
  flex: 1;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin-top: 12px;
`

const WishlistsContainer = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  padding: 24px 24px;
  width: 100%;
  margin-top: 24px;
  border-top-width: 1px;
  border-color: #00000015;
`;

const Avatar = styled(Image)`
  width: 130px;
  height: 130px;
  border-radius: 65px;
  margin-top: 12px;
  margin-bottom: 12px;
`;