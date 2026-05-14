import styled from "styled-components/native";

type IconButtonProps = { 
    icon: React.ReactNode; 
    onPress: () => void  
    size?: number
    backgroundColor?: string | "transparent"
    alt?: string;
};

export default function IconButton(props: IconButtonProps) {

    const buttonSize = props.size || 32;

    const Button = styled.TouchableOpacity`
        justify-content: center;
        align-items: center;
        width: ${buttonSize}px;
        height: ${buttonSize}px;
        border-radius: 50%;
        background-color: ${props.backgroundColor || "#ffffff30"};
    `

    return (
        <Button onPress={props.onPress} accessibilityLabel={props.alt}>
            {props.icon}
        </Button>
    );
}