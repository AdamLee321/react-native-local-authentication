import { Platform } from 'react-native';
import LocalAuthenticationNativeModule from './nativeModule';
import {
    LocalAuthenticationInterface,
    BiometryTypeIOS,
    BiometryTypeIOSEnum,
    AuthenticateOptionsIOS,
    AuthenticateResponse, AuthenticateOptionsAndroid,
} from './types';

const { isSupportedAsync, isAvailableAsync, getBiometryStatusAsync, biometryType, authenticateAsync: nativeAuthenticateAsync } = LocalAuthenticationNativeModule;

/**
 * Get device supported biometry type
 *
 * @returns BiometryTypeIOS | null
 */
function getBiometryType(): BiometryTypeIOS | null {
    if (Platform.OS === 'android') {
        return null;
    }

    switch (biometryType) {
        case BiometryTypeIOSEnum.FaceID:
            return 'FaceID';
        case BiometryTypeIOSEnum.TouchID:
            return 'TouchID';
        default:
            return 'None';
    }
}

/**
 * Authenticate user with their biometrics
 *
 * @param options AuthenticateOptionsIOS
 * @return Promise<AuthenticateResponse>
 */
async function authenticateAsync(options: AuthenticateOptionsIOS | AuthenticateOptionsAndroid): Promise<AuthenticateResponse> {
    const response: AuthenticateResponse = await nativeAuthenticateAsync(options);

    if (response.warning) {
        console.warn(response.warning);
    }

    return response;
}

/**
 * Release memory (for android)
 */
function release(): void {
    if (Platform.OS === 'android') {
        return LocalAuthenticationNativeModule.release();
    }

    return;
}

export default {
    isSupportedAsync,
    isAvailableAsync,
    getBiometryStatusAsync,
    getBiometryType,
    authenticateAsync,
    release,
} as LocalAuthenticationInterface;
