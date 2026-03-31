'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Announcement, Category, ShopSettings, ThemeSettings } from '@/types/app'

export default function ShopTab({
  categories,
  announcements,
  shopSettings,
  theme,
  isAdmin,
}: {
  categories: Category[]
  announcements: Announcement[]
  shopSettings: ShopSettings
  theme: ThemeSettings
  isAdmin: boolean
}) {
  const [openCategories, setOpenCategories] = useState<number[]>([])
  const hasInitialized = useRef(false)

  const visibleCategories = useMemo(() => {
    if (isAdmin) {
      return categories
    }

    return categories
      .filter((category) => category.isVisible)
      .map((category) => ({
        ...category,
        products: category.products.filter((product) => product.isVisible),
      }))
  }, [categories, isAdmin])

  const visibleAnnouncements = announcements.filter(
    (announcement) => announcement.isVisible
  )

  useEffect(() => {
    if (!hasInitialized.current && visibleCategories.length > 0) {
      setOpenCategories([visibleCategories[0].id])
      hasInitialized.current = true
    }
  }, [visibleCategories])

  function toggleCategory(categoryId: number) {
    setOpenCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  return (
    <div
      style={{
        paddingBottom: 110,
        maxWidth: 520,
        margin: '0 auto',
        color: theme.textColor,
      }}
    >
      <div
        style={{
          background: theme.cardColor,
          borderRadius: 20,
          padding: 18,
          marginBottom: 18,
          border: `1px solid ${theme.cardBorderColor}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          {shopSettings.shopLogoUrl ? (
            <img
              src={shopSettings.shopLogoUrl}
              alt="Shop logo"
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                objectFit: 'cover',
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: '#2a2a2a',
                flexShrink: 0,
              }}
            />
          )}

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 24,
                lineHeight: 1.1,
              }}
            >
              {shopSettings.shopName}
            </h2>

            <p
              style={{
                margin: '6px 0 0 0',
                color: theme.mutedTextColor,
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              {shopSettings.shopDescription}
            </p>
          </div>
        </div>
      </div>

      {visibleAnnouncements.length > 0 && (
        <div
          style={{
            background: theme.cardColor,
            borderRadius: 16,
            padding: 14,
            marginBottom: 16,
            border: `1px solid ${theme.cardBorderColor}`,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: theme.accentTextColor,
              background: theme.accentColor,
              display: 'inline-block',
              padding: '6px 10px',
              borderRadius: 8,
              marginBottom: 10,
            }}
          >
            Latest Announcement
          </div>

          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
            {visibleAnnouncements[0].title}
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.45,
              color: theme.mutedTextColor,
              whiteSpace: 'pre-wrap',
            }}
          >
            {visibleAnnouncements[0].body}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {visibleCategories.map((category) => {
          const isCategoryOpen = openCategories.includes(category.id)

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                style={{
                  width: '100%',
                  background: theme.cardColor,
                  color: theme.textColor,
                  border: `1px solid ${theme.cardBorderColor}`,
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 18,
                  fontWeight: 700,
                  cursor: 'pointer',
                  opacity: category.isVisible ? 1 : 0.65,
                }}
              >
                <span>
                  {category.title}
                  {isAdmin && !category.isVisible ? ' · hidden' : ''}
                </span>
                <span style={{ fontSize: 14 }}>{isCategoryOpen ? '▲' : '▼'}</span>
              </button>

              {isCategoryOpen && (
                <div
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      style={{
                        background: theme.cardColor,
                        borderRadius: 16,
                        padding: 12,
                        border: `1px solid ${theme.cardBorderColor}`,
                        position: 'relative',
                        opacity: product.isVisible ? 1 : 0.75,
                      }}
                    >
                      {isAdmin && !product.isVisible && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.45)',
                            borderRadius: 16,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 8,
                            zIndex: 2,
                            pointerEvents: 'none',
                          }}
                        >
                          <div style={{ fontSize: 34 }}>🙈</div>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: '#fff',
                              background: 'rgba(0,0,0,0.45)',
                              padding: '6px 10px',
                              borderRadius: 8,
                            }}
                          >
                            Hidden for customers
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: 96,
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            style={{
                              width: 96,
                              height: 96,
                              objectFit: 'cover',
                              borderRadius: 12,
                              background: '#222',
                              display: 'block',
                              marginBottom: product.video ? 8 : 0,
                            }}
                          />

                          {product.video && (
                            <video
                              src={product.video}
                              controls
                              playsInline
                              style={{
                                width: 96,
                                height: 96,
                                objectFit: 'cover',
                                borderRadius: 12,
                                display: 'block',
                                background: '#000',
                              }}
                            />
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 18,
                              lineHeight: 1.2,
                              wordBreak: 'break-word',
                              color: theme.textColor,
                            }}
                          >
                            {product.title}
                          </h4>

                          <p
                            style={{
                              marginTop: 6,
                              marginBottom: 10,
                              color: theme.mutedTextColor,
                              fontSize: 13,
                              lineHeight: 1.45,
                            }}
                          >
                            {product.description}
                          </p>

                          <div
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 6,
                            }}
                          >
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{
                                  background: theme.accentColor,
                                  color: theme.accentTextColor,
                                  padding: '5px 9px',
                                  borderRadius: 7,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: 1,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {category.products.length === 0 && (
                    <div
                      style={{
                        background: theme.cardColor,
                        borderRadius: 16,
                        padding: 12,
                        border: `1px solid ${theme.cardBorderColor}`,
                        color: theme.mutedTextColor,
                        fontSize: 13,
                      }}
                    >
                      {isAdmin
                        ? 'Geen producten in deze categorie.'
                        : 'Nog geen zichtbare producten in deze categorie.'}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {visibleCategories.length === 0 && (
          <div
            style={{
              background: theme.cardColor,
              borderRadius: 16,
              padding: 12,
              border: `1px solid ${theme.cardBorderColor}`,
              color: theme.mutedTextColor,
              fontSize: 13,
            }}
          >
            {isAdmin ? 'Nog geen categorieën.' : 'Nog geen zichtbare categorieën.'}
          </div>
        )}
      </div>
    </div>
  )
}