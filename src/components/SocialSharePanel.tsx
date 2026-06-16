import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Share2, 
  Twitter, 
  Send, 
  Facebook, 
  Copy, 
  Download, 
  Check, 
  ChevronDown, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Language } from '../utils/i18n';

interface SocialSharePanelProps {
  language: Language;
  activeMoodId: string;
  activeMoodName: string;
  isExporting: boolean;
  isSharing: boolean;
  onDownload: () => Promise<void>;
  onShareNative: () => Promise<void>;
  t: (key: string) => string;
  showToast: (message: string) => void;
}

export const SocialSharePanel: React.FC<SocialSharePanelProps> = ({
  language,
  activeMoodId,
  activeMoodName,
  isExporting,
  isSharing,
  onDownload,
  onShareNative,
  t,
  showToast
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate share message and links dynamically
  const shareText = t('shareMessageBody').replace('{name}', activeMoodName);
  const shareUrl = window.location.href;
  const fullShareText = `${shareText} - ${shareUrl}`;

  // Custom localized translations for the share panel elements
  const localTexts = {
    fr: {
      btnLabel: "Partager l'écran AOD",
      title: "Partager votre configuration",
      sub: "Partagez votre humeur et votre identité sur vos réseaux préférés !",
      copyLink: "Copier le lien",
      copied: "Lien copié !",
      directShare: "Partage Direct 📲",
      directShareDesc: "Partagez l'image AOD directement",
      twitter: "Partager sur X",
      whatsapp: "Envoyer sur WhatsApp",
      facebook: "Partager sur Facebook",
      downloadSnapshot: "Enregistrer l'image"
    },
    en: {
      btnLabel: "Share AOD Screenshot",
      title: "Share your configuration",
      sub: "Share your mood and identity on your favorite social networks!",
      copyLink: "Copy Link",
      copied: "Link copied!",
      directShare: "Direct Share 📲",
      directShareDesc: "Share the AOD image block directly",
      twitter: "Share on X",
      whatsapp: "Send to WhatsApp",
      facebook: "Share on Facebook",
      downloadSnapshot: "Save Image"
    },
    es: {
      btnLabel: "Compartir pantalla AOD",
      title: "Compartir tu configuración",
      sub: "¡Comparte tu humor e identidad en tus redes sociales favoritas!",
      copyLink: "Copiar enlace",
      copied: "¡Copiado!",
      directShare: "Compartir Directo 📲",
      directShareDesc: "Comparte el bloque de imagen AOD directamente",
      twitter: "Compartir en X",
      whatsapp: "Enviar por WhatsApp",
      facebook: "Compartir en Facebook",
      downloadSnapshot: "Guardar imagen"
    },
    zh: {
      btnLabel: "分享 AOD 的截图屏保",
      title: "分享您的专属屏保",
      sub: "在您最喜欢的社交网络上展示您当下的心情和性别色彩！",
      copyLink: "复制分享链接",
      copied: "已复制成功！",
      directShare: "系统直接分享 📲",
      directShareDesc: "在移动端设备直接分享 AOD 图片",
      twitter: "分享至 X / 推特",
      whatsapp: "发送至 WhatsApp",
      facebook: "分享至 Facebook",
      downloadSnapshot: "保存图片到本地"
    }
  };

  const labels = localTexts[language] || localTexts.fr;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      showToast(t('shareAlertText'));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = fullShareText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (success) {
        setCopied(true);
        showToast(t('shareAlertText'));
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const getTwitterUrl = () => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  };

  const getWhatsAppUrl = () => {
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(fullShareText)}`;
  };

  const getFacebookUrl = () => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  };

  return (
    <div id="social-share-interactive-module" className="w-full relative">
      {/* Primary Trigger Button */}
      <button
        id="btn-toggle-social-sharing"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 bg-[#111113] hover:bg-[#18181b] border ${isOpen ? 'border-[#9B23EA]/40 text-white' : 'border-white/10 text-white/80'} font-semibold py-3 px-4 rounded-xl transition-all cursor-pointer text-xs font-display`}
      >
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#9B23EA] animate-pulse" />
          <span>{labels.btnLabel}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/45 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#9B23EA]' : 'rotate-0'}`} />
      </button>

      {/* Accordion Content with framer motion animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="bg-[#111113]/60 border border-white/5 rounded-2xl p-4.5 space-y-4 backdrop-blur-md">
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-white/95 font-display flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#9B23EA]" />
                  {labels.title}
                </h4>
                <p className="text-[10px] text-white/45 leading-relaxed">
                  {labels.sub}
                </p>
              </div>



              {/* High-fidelity full-width specialized actions */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                {/* Image Capture & Hardware Native Share */}
                <button
                  onClick={onShareNative}
                  disabled={isSharing}
                  className={`w-full flex items-center justify-between gap-3 bg-[#9B23EA]/10 border border-[#9B23EA]/30 text-white/90 rounded-xl p-2.5 text-[11px] font-medium transition-all hover:bg-[#9B23EA]/20 hover:border-[#9B23EA]/55 cursor-pointer ${isSharing ? 'opacity-60 cursor-wait' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#9B23EA]" />
                    <div className="text-left">
                      <p className="font-semibold">{labels.directShare}</p>
                      <p className="text-[9px] text-white/40 font-light">{labels.directShareDesc}</p>
                    </div>
                  </div>
                  <Share2 className="w-3.5 h-3.5 text-[#9B23EA]" />
                </button>

                {/* Download wallpaper file locally */}
                <button
                  onClick={onDownload}
                  disabled={isExporting}
                  className={`w-full flex items-center gap-2 bg-white/[0.02] border border-white/5 text-white/70 rounded-xl p-2.5 text-[11px] font-medium transition-all hover:bg-white/[0.05] hover:text-white cursor-pointer ${isExporting ? 'opacity-60 cursor-wait' : ''}`}
                >
                  <Download className="w-3.5 h-3.5 text-white/45" />
                  <span>{labels.downloadSnapshot}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
