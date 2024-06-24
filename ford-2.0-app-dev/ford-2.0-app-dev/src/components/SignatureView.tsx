import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Signature, { SignatureViewRef } from "react-native-signature-canvas";
import { theme } from '../core/theme';
import ButtonText from './Buttons/ButtonText';
export type ImageType = "image/png" | "image/jpeg" | "image/svg+xml";

interface Props {
    defaultValue?: string;
    imageType?: ImageType;
    onDrawBegin?: () => void;
    onDrawEnd?: (signature: string) => void;
    showClearButton?: boolean;
    onClear?: () => void;
}

const SignatureView = ({
    defaultValue,
    imageType = 'image/jpeg',
    onDrawBegin,
    onDrawEnd,
    showClearButton = false,
    onClear
}: Props) => {
    const ref = useRef<SignatureViewRef>(null);
    const style = useMemo(() => {
        return `
            .m-signature-pad { font-size: 10px; width: 100%; height: 100%; margin: 0; border: 1px solid #e8e8e8; background-color: #fff; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;}
            .m-signature-pad--footer {display: none; margin: 0px;}
            body, html {margin:0; padding:0; width: 100%; height: 100%;}
        `;
    }, []);

    // useEffect(() => {
    //     if (defaultValue) {
    //         ref.current?.readSignature();
    //     }
    // }, [defaultValue])

    // Called after ref.current.readSignature() reads a non-empty base64 string
    const handleOK = (signature: any) => {
        if (onDrawEnd)
            onDrawEnd(signature);
    };

    // Called after ref.current.clearSignature()
    const handleClear = () => {
        if (onClear)
            onClear();
    };

    // Called after end of stroke
    const handleEnd = () => {
        ref.current?.readSignature();
    };

    return (
        <View style={styles.container}>
            <Signature
                webStyle={style}
                ref={ref}
                backgroundColor={'rgba(255,255,255)'}
                imageType={imageType}
                dataURL={defaultValue}
                onBegin={onDrawBegin}
                onEnd={handleEnd}
                onOK={handleOK}
                onClear={handleClear}
                descriptionText={'Texto descriptivo'}
                
            />
            {showClearButton
                ?
                <ButtonText
                    style={{ position: 'absolute', bottom: 0 }}
                    title='Borrar firma'
                    color={theme.colors.warn}
                    textColor={theme.colors.warn}
                    onPress={() => {
                        ref.current?.clearSignature()
                    }}
                    uppercase={false}
                />
                :
                null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default SignatureView;