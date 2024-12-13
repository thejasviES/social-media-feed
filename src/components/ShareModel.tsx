import { useState, useEffect } from "react";
import { X, Copy } from "lucide-react";
import {
  TwitterShareButton,
  FacebookShareButton,
  RedditShareButton,
  WhatsappShareButton,
  TelegramShareButton,
} from "react-share";
import {
  FaTwitter,
  FaFacebookF,
  FaRedditAlien,
  FaDiscord,
  FaWhatsapp,
  FaFacebookMessenger,
  FaTelegramPlane,
  FaInstagram,
} from "react-icons/fa";
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}
const ShareModal = ({ isOpen, onClose, url, title }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleEscape = (e: any) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const socialLinks = [
    {
      name: "Twitter",
      icon: FaTwitter,
      component: TwitterShareButton,
      color: "bg-blue-400",
    },
    {
      name: "Facebook",
      icon: FaFacebookF,
      component: FacebookShareButton,
      color: "bg-blue-600",
    },
    {
      name: "Reddit",
      icon: FaRedditAlien,
      component: RedditShareButton,
      color: "bg-orange-600",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      color: "bg-indigo-600",
      onClick: () => window.open(`https://discord.com/share?url=${url}`),
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      component: WhatsappShareButton,
      color: "bg-green-500",
    },
    {
      name: "Messenger",
      icon: FaFacebookMessenger,
      color: "bg-blue-500",
      onClick: () => window.open(`https://www.messenger.com/share?url=${url}`),
    },
    {
      name: "Telegram",
      icon: FaTelegramPlane,
      component: TelegramShareButton,
      color: "bg-blue-500",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500",
      onClick: () => window.open(`https://instagram.com/share?url=${url}`),
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 relative animate-in fade-in-0 zoom-in-95">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Share post</h2>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {socialLinks.map((social) => {
            const ShareButton = social.component;
            const Icon = social.icon;

            return ShareButton ? (
              <ShareButton
                key={social.name}
                url={url}
                title={title}
                hashtag="#portfolio"
              >
                <div className="flex flex-col items-center gap-2 cursor-pointer">
                  <div
                    className={`w-16 h-16 rounded-full ${social.color} flex items-center justify-center hover:opacity-90 transition-opacity`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm">{social.name}</span>
                </div>
              </ShareButton>
            ) : (
              <button
                key={social.name}
                onClick={social.onClick}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-16 h-16 rounded-full ${social.color} flex items-center justify-center hover:opacity-90 transition-opacity`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="text-gray-600 text-sm">{social.name}</span>
              </button>
            );
          })}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Page Link</h3>
          <div className="flex gap-2">
            <input
              value={url}
              readOnly
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={handleCopy}
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
        {copied && (
          <p className="text-green-600 mt-2 text-sm">
            Link copied to clipboard!
          </p>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
