import { images } from "@/constants/images";
import { router, usePathname } from "expo-router";
import { useCallback } from "react";
import { Txt } from "../ui/text";
import { Avatar, Container, NameColumn } from "./styles";
import { UserSearchCardProps } from "./UserComponent";

export function UserSearchCard({user, allowNavigation = true}: UserSearchCardProps) {
    const pathname = usePathname();

    const goToUserProfile = useCallback(() => {
        if (!allowNavigation) {
            return;
        }

        router.push({
            pathname: "/(protected)/users/[userId]",
            params: { userId: user.id, from: pathname }
        })
    }, [allowNavigation, pathname, user.id]);

    return (
        <Container onPress={() => goToUserProfile()}>
            <Avatar source={user.image || images.avatarPlaceholder}/>
            <NameColumn>
                <Txt text={user.name} weight="semi" size={16}/>
                <Txt text={user.email} weight="light" size={12}/>
            </NameColumn>
        </Container>
    )
}
