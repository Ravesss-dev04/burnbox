export interface ToolTipProps {
    buttons: string[];
    setToolTip: (tooltip: boolean) => void;
}

export interface FeaturedImageProps {
    imagePath: string;
    dimension: number;
}

export interface BlurredLightsProps {
    size: string;
    color: string;
    position: string;
    delay: number;
    float: [number, number, number];
}

export interface IntroductionVideoProps {
    isVideoVisible: (videoVisible: boolean) => void;
}

export interface EmailPopupProps {
    setShowEmailPopup: (showEmailPopup: boolean) => void;
}


export interface ContentEditableProps {
   
    editable: boolean
}