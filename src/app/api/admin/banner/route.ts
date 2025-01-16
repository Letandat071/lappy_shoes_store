import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import HeroBanner from "@/models/HeroBanner";
import { getAdminFromToken } from "@/lib/auth";

const DEFAULT_BANNER = {
  image: '',
  event: '',
  titleLine1: '',
  titleLine2: '',
  description: '',
  highlightedWords: [],
  stats: [],
  features: [],
  styles: {
    backgroundColor: {
      from: '#111827',
      via: '#000000',
      to: '#111827'
    },
    eventBadge: {
      textColor: '#FCD34D',
      backgroundColor: 'rgba(251, 191, 36, 0.1)'
    },
    title: {
      glowColor: '#FCD34D',
      gradientColors: {
        from: '#FCD34D',
        via: '#EF4444',
        to: '#9333EA'
      }
    },
    description: {
      textColor: '#D1D5DB'
    },
    buttons: {
      primary: {
        textColor: '#000000',
        backgroundColor: '#FFFFFF',
        hoverBackgroundColor: '#FCD34D'
      },
      secondary: {
        textColor: '#FFFFFF',
        borderColor: '#FFFFFF',
        hoverBackgroundColor: '#FFFFFF',
        hoverTextColor: '#000000'
      }
    },
    stats: {
      valueColor: '#FFFFFF',
      labelColor: '#9CA3AF'
    },
    glowEffects: {
      topLeft: {
        color: '#FCD34D',
        opacity: 0.5,
        blur: 100
      },
      bottomRight: {
        color: '#9333EA',
        opacity: 0.5,
        blur: 100
      }
    }
  },
  overlayOpacity: 0.2,
  particlesEnabled: true
};

export async function GET() {
  try {
    await connectDB();
    const banner = await HeroBanner.findOne().sort({ createdAt: -1 });
    
    if (!banner) {
      return NextResponse.json(DEFAULT_BANNER);
    }

    // Đảm bảo trả về đầy đủ cấu trúc styles
    const bannerData = banner.toObject();
    const response = {
      ...DEFAULT_BANNER,
      ...bannerData,
      styles: {
        ...DEFAULT_BANNER.styles,
        ...(bannerData.styles || {})
      }
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      image,
      event,
      titleLine1,
      titleLine2,
      description,
      highlightedWords,
      stats,
      features,
      styles,
      overlayOpacity,
      particlesEnabled
    } = body;

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    // Tìm banner hiện tại
    const currentBanner = await HeroBanner.findOne().sort({ createdAt: -1 });

    // Đảm bảo styles được lưu đúng cấu trúc
    const updatedStyles = {
      backgroundColor: {
        from: styles?.backgroundColor?.from || DEFAULT_BANNER.styles.backgroundColor.from,
        via: styles?.backgroundColor?.via || DEFAULT_BANNER.styles.backgroundColor.via,
        to: styles?.backgroundColor?.to || DEFAULT_BANNER.styles.backgroundColor.to
      },
      eventBadge: {
        textColor: styles?.eventBadge?.textColor || DEFAULT_BANNER.styles.eventBadge.textColor,
        backgroundColor: styles?.eventBadge?.backgroundColor || DEFAULT_BANNER.styles.eventBadge.backgroundColor
      },
      title: {
        glowColor: styles?.title?.glowColor || DEFAULT_BANNER.styles.title.glowColor,
        gradientColors: {
          from: styles?.title?.gradientColors?.from || DEFAULT_BANNER.styles.title.gradientColors.from,
          via: styles?.title?.gradientColors?.via || DEFAULT_BANNER.styles.title.gradientColors.via,
          to: styles?.title?.gradientColors?.to || DEFAULT_BANNER.styles.title.gradientColors.to
        }
      },
      description: {
        textColor: styles?.description?.textColor || DEFAULT_BANNER.styles.description.textColor
      },
      buttons: {
        primary: {
          textColor: styles?.buttons?.primary?.textColor || DEFAULT_BANNER.styles.buttons.primary.textColor,
          backgroundColor: styles?.buttons?.primary?.backgroundColor || DEFAULT_BANNER.styles.buttons.primary.backgroundColor,
          hoverBackgroundColor: styles?.buttons?.primary?.hoverBackgroundColor || DEFAULT_BANNER.styles.buttons.primary.hoverBackgroundColor
        },
        secondary: {
          textColor: styles?.buttons?.secondary?.textColor || DEFAULT_BANNER.styles.buttons.secondary.textColor,
          borderColor: styles?.buttons?.secondary?.borderColor || DEFAULT_BANNER.styles.buttons.secondary.borderColor,
          hoverBackgroundColor: styles?.buttons?.secondary?.hoverBackgroundColor || DEFAULT_BANNER.styles.buttons.secondary.hoverBackgroundColor,
          hoverTextColor: styles?.buttons?.secondary?.hoverTextColor || DEFAULT_BANNER.styles.buttons.secondary.hoverTextColor
        }
      },
      stats: {
        valueColor: styles?.stats?.valueColor || DEFAULT_BANNER.styles.stats.valueColor,
        labelColor: styles?.stats?.labelColor || DEFAULT_BANNER.styles.stats.labelColor
      },
      glowEffects: {
        topLeft: {
          color: styles?.glowEffects?.topLeft?.color || DEFAULT_BANNER.styles.glowEffects.topLeft.color,
          opacity: styles?.glowEffects?.topLeft?.opacity || DEFAULT_BANNER.styles.glowEffects.topLeft.opacity,
          blur: styles?.glowEffects?.topLeft?.blur || DEFAULT_BANNER.styles.glowEffects.topLeft.blur
        },
        bottomRight: {
          color: styles?.glowEffects?.bottomRight?.color || DEFAULT_BANNER.styles.glowEffects.bottomRight.color,
          opacity: styles?.glowEffects?.bottomRight?.opacity || DEFAULT_BANNER.styles.glowEffects.bottomRight.opacity,
          blur: styles?.glowEffects?.bottomRight?.blur || DEFAULT_BANNER.styles.glowEffects.bottomRight.blur
        }
      }
    };

    // Nếu có banner, cập nhật. Nếu không, tạo mới
    const result = currentBanner 
      ? await HeroBanner.findByIdAndUpdate(
          currentBanner._id,
          {
            image,
            event,
            titleLine1,
            titleLine2,
            description,
            highlightedWords,
            stats,
            features,
            styles: updatedStyles,
            overlayOpacity,
            particlesEnabled,
            updatedBy: admin._id
          },
          { new: true }
        )
      : await HeroBanner.create({
          image,
          event,
          titleLine1,
          titleLine2,
          description,
          highlightedWords,
          stats,
          features,
          styles: updatedStyles,
          overlayOpacity,
          particlesEnabled,
          createdBy: admin._id,
          updatedBy: admin._id
        });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 