// ─── Cão Doado — Design System ────────────────────────────────────────────────
// Paleta: Roxo rico + Coral como acento + Fundo creme quente
// Estilo: Colorido e acolhedor | Bordas levemente arredondadas


export const colors = {
    primary: "#6A0DAD", // Roxo rico
    primaryLight: "#9B59B6", // Roxo claro para hover/ativo
    primaryDark: "#4B0082", // Roxo escuro para texto ou elementos secundários
    primarySurface: "#F5F5F5", // Fundo creme quente para superfícies

    // Cores de acento
    accent: "#FF6F61", // Coral vibrante para botões e destaques
    accentLight: "#FF8A75", // Coral claro para hover/ativo
    accentDark: "#E55B50", // Coral escuro para texto ou elementos secundários
    accentSurface: "#FFF0E0", // Fundo creme claro para superfícies de acento

    // Status dos casos

    status: {
        statusAberto: "#FF6F61", // Coral para casos abertos
        statusEmAndamento: "#6A0DAD", // Roxo para casos em andamento
        statusResolvido: "#2ECC71", // Verde para casos resolvidos
        statusFechado: "#95A5A6", // Cinza para casos fechados
        statusAbertoSurface: "#FFF0E0", // Fundo creme claro para casos abertos
        statusEmAndamentoSurface: "#F5F5F5", // Fundo creme para casos em andamento
        statusResolvidoSurface: "#E8F8F5", // Fundo verde claro para casos resolvidos
        statusFechadoSurface: "#ECF0F1", // Fundo cinza claro para casos fechados
        },

    // Neutros quentes

    background: "#F5F5F5", // Fundo creme quente para a aplicação
    surface: "#FFFFFF", // Branco para superfícies
    surface2: "#FFF0E0", // Fundo creme claro para superfícies secundárias

    textPrimary: "#333333", // Texto principal em cinza escuro
    textSecondary: "#666666", // Texto secundário em cinza médio
    textOnPrimary: "#FFFFFF", // Texto branco para elementos sobre a cor primária
    textOnAccent: "#FFFFFF", // Texto branco para elementos sobre a cor de acento
    textMuted: "#999999", // Texto em cinza claro para informações menos importantes
    textInverted: "#FFFFFF", // Texto branco para fundos escuros
    textInvertedSecondary: "#CCCCCC", // Texto cinza claro para fundos escuros
    textInvertedMuted: "#666666", // Texto cinza médio para fundos escuros

    //bordas e sombras
    border: "#E0E0E0", // Cor de borda neutra
    borderLight: "#F0F0F0", // Cor de borda clara para hover/ativo
    borderDark: "#B0B0B0", // Cor de borda escura para elementos secundários
    shadow: "rgba(0, 0, 0, 0.1)", // Sombra leve para profundidade
    shadowDark: "rgba(0, 0, 0, 0.2)", // Sombra mais escura para elementos elevados

    divider: "#E0E0E0", // Cor para divisores entre seções
    dividerLight: "#F0F0F0", // Cor para divisores claros
    dividerDark: "#B0B0B0", // Cor para divisores escuros

    white: "#FFFFFF", // Branco puro
    black: "#000000", // Preto puro
    transparent: "transparent", // Transparente para sobreposições e efeitos
};

export const typography = {
    fontFamily: "System", // Fonte padrão do sistema para uma aparência nativa
    fontSize: {
        xs: 10, // Tamanho extra pequeno para legendas e texto muito pequeno
        small: 12, // Tamanho pequeno para legendas e texto secundário
        base: 14, // Tamanho base para texto normal
        medium: 16, // Tamanho médio para texto principal
        large: 20, // Tamanho grande para títulos e destaques
        xlarge: 24, // Tamanho extra grande para títulos principais
        xxlarge: 32, // Tamanho extra extra grande para títulos de destaque máximo
        hero: 40, // Tamanho hero para títulos de destaque extremo e elementos de destaque máximo
    },
    fontWeight: {
        regular: "400" as const, // Peso regular para texto normal
        medium: "500" as const, // Peso médio para destaque leve
        bold: "700" as const, // Peso negrito para títulos e destaques fortes
        semibold: "600" as const, // Peso seminegrito para títulos e destaques moderados
        extrabold: "800" as const, // Peso extranegrito para títulos principais e elementos de destaque máximo   
        black: "900" as const, // Peso preto para títulos muito importantes e elementos de destaque extremo
    },
};

export const spacing = {
    none: 0,
    xs: 4, // Extra pequeno para pequenos espaçamentos
    sm: 8, // Pequeno para espaçamento entre elementos próximos
    md: 12, // Médio para espaçamento padrão entre seções
    base: 16, // Base para espaçamento geral entre elementos
    lg: 20, // Grande para espaçamento generoso entre seções
    xl: 24, // Extra grande para espaçamento amplo em layouts mais arejados
    xxl: 32, // Extra extra grande para espaçamento máximo em layouts muito arejados
    xxxl: 40, // Extra extra extra grande para espaçamento extremo em layouts muito arejados ou para elementos de destaque máximo
};

export const borderRadius = {
    none: 0,
    sm: 4, // Levemente arredondado para elementos menores
    md: 8, // Arredondado médio para botões e cartões
    lg: 16, // Arredondado grande para elementos de destaque
    full: 9999, // Totalmente arredondado para círculos ou elementos completamente arredondados
};

export const shadows = {
    none: "none",
    light: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Sombra leve para profundidade sutil
    medium: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Sombra média para elementos elevados
    heavy: "0px 10px 20px rgba(0, 0, 0, 0.2)", // Sombra pesada para elementos muito elevados
};

export const zIndex = {
    background: 0,
    default: 1,
    dropdown: 1000,
    modal: 1100,
    popover: 1200,
    tooltip: 1300,
};


export type CaseStatus = "ABERTO" | "EM_ANDAMENTO" | "RESOLVIDO" | "FECHADO";

export const STATUS_META: Record<CaseStatus, { 
     label: string; color: string; surface: string, pinColor: string
     }> = {
    ABERTO: { label: "Aberto", color: colors.status.statusAberto, surface: colors.status.statusAbertoSurface, pinColor: colors.status.statusAberto },
    EM_ANDAMENTO: { label: "Em Andamento", color: colors.status.statusEmAndamento, surface: colors.status.statusEmAndamentoSurface, pinColor: colors.status.statusEmAndamento },
    RESOLVIDO: { label: "Resolvido", color: colors.status.statusResolvido, surface: colors.status.statusResolvidoSurface, pinColor: colors.status.statusResolvido },
    FECHADO: { label: "Fechado", color: colors.status.statusFechado, surface: colors.status.statusFechadoSurface, pinColor: colors.status.statusFechado },
};
