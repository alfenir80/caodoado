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

// ─── Badge ───────────────────────────────────────────────────────────────────
// Pill colorida para exibir o status de um caso.
// Recebe cor e surface vindos de STATUS_META do tema.

interface BadgeProps {
    label: string;
    color: string;
    surface: string;
}

export function Badge({ label, color, surface}: BadgeProps){
    return (
        <View style={[badgeStyles.base, { backgroundColor: surface }]}>
            <View style={[badgeStyles.dot, { backgroundColor: color }]} />
            <Text style={[badgeStyles.label, { color }]}>{label}</Text>
        </View>
    );


}

const badgeStyles = StyleSheet.create({
    base: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.full,
        alignSelf: "flex-start",
        gap: spacing.xs,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: borderRadius.full,
    },

    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: 0.5,
        textTransform: "uppercase",
    },
});

// ─── Card ────────────────────────────────────────────────────────────────────
// Container com fundo branco, borda e sombra roxa suave.
// Aceita onPress para virar um item clicável.

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
}

const cardStyles = StyleSheet.create({
    base: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        shadowColor: shadows.light,
        shadowOffset: { width: 0, height: 1 },
        borderWidth: 1,
        borderColor: colors.primary + "20",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    pressable: {
        marginVertical: spacing.sm,
    },
});

export function Card({ children, onPress, style }: CardProps) {
    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} style={[cardStyles.base, cardStyles.pressable, style]}>
                {children}
            </TouchableOpacity>
        );
    }
    return <View style={[cardStyles.base, style]}>{children}</View>;
}

// ─── SectionTitle ─────────────────────────────────────────────────────────────
// Label de seção: caixa alta, espaçado, cor neutra.
// Usado para separar blocos de conteúdo dentro de uma tela.

interface SectionTitleProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const sectionTitleStyles = StyleSheet.create({
    base: {
        fontSize: typography.fontSize.large,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textMuted,
        letterSpacing: 1,
        textTransform: "uppercase",
        marginBottom: spacing.sm,
    },
});

export function SectionTitle({ children, style }: SectionTitleProps) {
    return <Text style={[sectionTitleStyles.base, style]}>{children}</Text>;
}

// ─── StyledInput ─────────────────────────────────────────────────────────────
// Campo de texto com label opcional acima.
// Borda usa a cor do tema para manter coesão.

interface StyledInputProps extends TextInputProps {
    label?: string;
}

const styledInputStyles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },
    label: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.textMuted,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.primary + "40",
        borderRadius: borderRadius.sm,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
    },
});

export function StyledInput({ label, style, ...rest }: StyledInputProps) {
    return (
        <View style={styledInputStyles.container}>
            {label && <Text style={styledInputStyles.label}>{label}</Text>}
            <TextInput style={[styledInputStyles.input, style]} {...rest} />
        </View>
    );
}

  