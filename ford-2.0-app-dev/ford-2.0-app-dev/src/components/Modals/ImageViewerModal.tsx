import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Modal } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { ImageURISource } from "react-native";
import ButtonIcon from '../Buttons/ButtonIcon';
import { hideImageViewerModal } from '../../store/action/imageViewerModalAction';
import { theme } from '../../core/theme';

interface Props {
    isVisible: boolean,
    image?: ImageURISource
}
const ImageViewerModal = ({ isVisible, image }: Props) => {
    const dispatch = useDispatch();

    return (
        <Modal
            visible={isVisible}
            contentContainerStyle={styles.modal}
            dismissable={true}
            onDismiss={() => { dispatch(hideImageViewerModal()) }}
            style={{ backgroundColor: '#0000007A' }}
        >
            <View style={[styles.content, { width: image?.width ?? 500, height: image?.height ?? 500 }]}>
                <Image
                    source={{ uri: image?.uri }}
                    //onError={error => setShowDefaultImage(true)}
                    //resizeMode={'contain'}
                    style={[styles.image, { width: image?.width ?? 500, height: image?.height ?? 500 }]} />

                <ButtonIcon
                    icon='close'
                    color={theme.colors.textDark}
                    onPress={() => { dispatch(hideImageViewerModal()) }}
                    style={styles.closeButton}
                />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        //alignSelf: 'center',
        backgroundColor: '#0000005A',
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 12
    },
    content: {
        position: 'relative',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'contain',
        borderRadius: 2
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#ffffffBB'
    }
});

export default ImageViewerModal;