
import { TranslationSchema } from './types';

export const pt: TranslationSchema = {
  common: {
    appName: "Workoutron",
    appVersion: "3000",
    fullVersion: "3.1.0-PREVIEW",
    back: "Voltar",
    cancel: "Cancelar",
    confirm: "Confirmar",
    done: "Concluído",
    save: "Salvar",
    loading: "Carregando...",
    errorTitle: "Erro",
    storageLimitMsg: "Limite de armazenamento atingido: Exclua treinos antigos para salvar novos.",
    storageFullMsg: "Armazenamento cheio: Não foi possível salvar. Exclua rotinas da sua biblioteca primeiro.",
    unexpectedError: "Ocorreu un erro inesperado ao salvar."
  },
  header: {
    settings: "Configurações"
  },
  nav: {
    library: "Biblioteca",
    add: "Adicionar",
    history: "Histórico"
  },
  uploader: {
    analyzingTitle: "Analisando Equipamento",
    analyzingDesc: "Identificando equipamento e criando sua rotina especializada...",
    cameraDenied: "Acesso à câmera negado. Tente enviar uma foto.",
    snapTitle: "Tirar Foto",
    snapDesc: "Tire uma foto de qualquer equipamento para gerar uma rotina personalizada.",
    uploadBtn: "Enviar da Galeria",
    legalInfo: "Aviso de IA"
  },
  workout: {
    identified: "Identificado",
    exitBtn: "Sair do Treino",
    intensityTitle: "Modo de Intensidade",
    exerciseLabel: "EXERCÍCIO",
    sets: "SÉRIES",
    reps: "REPS",
    time: "TEMPO",
    dist: "DIST",
    rest: "DESCANSO",
    bodyweight: "Corpo",
    safetyTitle: "Segurança e Contexto",
    legalDisclaimerBtn: "Aviso Legal",
    legalModalTitle: "Aviso de Responsabilidade",
    legalBody: [
      "As rotinas geradas pelo Workoutron 3000 são fornecidas por IA apenas para fins informativos.",
      "Aviso: Sempre consulte um profissional de fitness ou médico antes de iniciar um novo programa de exercícios."
    ],
    legalUnderstand: "Eu entendo",
    startTraining: "Iniciar Treino",
    skip: "Pular",
    recovery: "Recuperação",
    complete: "Completo",
    doneWithSet: "Série concluída",
    langMismatch: "Gerado em um idioma diferente",
    shareBtn: "Compartilhar Rotina"
  },
  share: {
    title: "Compartilhar Sua Rotina",
    preview: "Visualização",
    downloadBtn: "Baixar Imagem",
    nativeBtn: "Escolher aplicativo",
    twitter: "Postar no X",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    // Fix: Added missing social platforms for Portuguese
    telegram: "Telegram",
    instagram: "Instagram",
    snapchat: "Snapchat",
    copyLink: "Copiar Link",
    linkCopied: "Link Copiado!",
    generatedBy: "Baixe Workoutron no Google Play ou Apple App Store"
  },
  library: {
    title: "Sua Biblioteca",
    searchPlaceholder: "Buscar equipamento...",
    noRoutinesTitle: "Sem rotinas salvas",
    noRoutinesDesc: "Escaneie equipamentos para construir sua biblioteca de treinamento pessoal.",
    removeTitle: "Remover Rotina",
    favAdd: "Adicionar aos Favoritos",
    favRemove: "Remover dos Favoritos"
  },
  activity: {
    title: "Hub de Atividade",
    descPrefix: "Histórico para",
    totalEffort: "Esforço Total",
    currentStreak: "Sequência Atual",
    days: "dias",
    consistency: "Consistência",
    intensityKey: "Chave de Intensidade",
    recentProgress: "Progresso Recente",
    lastSessions: "Últimas 10 sessões",
    noActivity: "Nenhuma atividade registrada. Comece escaneando um equipamento!",
    months: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    scores: {
      none: "Nenhum",
      elite: "Elite",
      pro: "Pro",
      good: "Bom",
      active: "Ativo"
    }
  },
  settings: {
    title: "Options",
    subtitle: "Personalize seu treino",
    prefTitle: "Preferências",
    prefDesc: "Escolha seus padrões de medida.",
    unitSystem: "Sistema de Unidades",
    metric: "Métrico",
    imperial: "Imperial",
    audioTitle: "Áudio e Feedback",
    audioDesc: "Gerencie sons e alertas.",
    interfaceSounds: "Sons da Interface",
    muted: "Mudo",
    enabled: "Ativado",
    aboutTitle: "Sobre",
    version: "Versão",
    aiModel: "Modelo IA",
    footer: "Construído para atletas",
    returnBtn: "Voltar ao Treino",
    language: "Idioma"
  },
  modals: {
    completeTitle: "Treino Concluído!",
    completeDesc: "Bom trabalho! Você terminou todos os exercícios desta sessão.",
    saveBtn: "Salvar na Biblioteca",
    savedBtn: "Salvo na Biblioteca",
    viewBtn: "Ver Rotina",
    duplicateTitle: "Duplicado Encontrado",
    duplicateDesc: "Você já tem \"{name}\" na sua biblioteca.",
    saveNew: "Salvar como Cópia Nova",
    updateExisting: "Actualizar Existente"
  }
};
