import React from "react";
import {
    View, Text, Pressable, TextInput,
    StyleSheet, TouchableOpacity, ActivityIndicator,
    type ViewStyle, type TextInputProps, type PressableProps,
} from "react-native";
import { colors, typography, spacing, borderRadius, shadows, zIndex } from "../screens/themes";

// ─── Button ──────────────────────────────────────────────────────────────────
// 4 variantes:
//   primary   → roxo sólido  (ação principal)
//   secondary → borda roxa   (ação secundária)
//   ghost     → sem borda    (ação terciária)
//   danger    → fundo coral  (ação destrutiva)
 

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends PressableProps {
    label: string;
    variant?: ButtonVariant;
    icon?: string;
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    variant = "primary",
    icon,
    disabled = false,
    loading = false,
    fullWidth = true,
    style,
    ...rest
}) => {

    const isDisabled = disabled || loading;

    const variantStyles = {
        primary: {
            backgroundColor: isDisabled ? colors.primary + "80" : colors.primary,
            borderColor: colors.primary,
            color: colors.white,
            text: colors.white,
        },
        secondary: {
            backgroundColor: "transparent",
            borderColor: isDisabled ? colors.primary + "80" : colors.primary,
            color: isDisabled ? colors.primary + "80" : colors.primary,
            text: colors.white
        },
        ghost: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            color: isDisabled ? colors.primary + "80" : colors.primary,
            text: colors.white
        },
        danger: {
            backgroundColor: isDisabled ? colors.accentSurface + "80" : colors.accent,
            borderColor: colors.accentLight,
            color: colors.white,
            text: colors.white
        },
    }[variant];

    return (
        <Pressable
            style={({ pressed }) => [
                btnStyles.base,
                { backgroundColor: variantStyles.backgroundColor, borderColor: variantStyles.borderColor }, 
                fullWidth && btnStyles.fullWidth,
                pressed && btnStyles.pressed,
                isDisabled && btnStyles.disabled,
                style as ViewStyle,
            ]}
            disabled={isDisabled}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator size="small" color={variantStyles.text} />
            ) : (
                <View style={btnStyles.inner}>
                    {icon && <Text style={[btnStyles.icon, { color: variantStyles.color, marginRight: label ? spacing.sm : 0 }]}>{icon}</Text>}
                    <Text style={[btnStyles.label, { color: variantStyles.text }]}>{label}</Text>
                </View>
            )}
        </Pressable>
    );
};

    
const btnStyles = StyleSheet.create({
    base: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        minHeight: 44,
        shadowColor: shadows.medium,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    fullWidth: { alignSelf: "stretch" },
    inner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
    label: {
        fontSize: typography.fontSize.medium,
        fontWeight: typography.fontWeight.medium,
    },
    icon: {
    },

    pressed: { opacity: 0.8, transform: [{ scale: 0.98 }]},

    disabled: { opacity: 0.6 },
      

});