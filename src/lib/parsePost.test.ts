import { describe, it, expect } from 'vitest'
import { parsePost } from './parsePost'

const RAW = `---
title: "Tervetuloa"
date: 2026-06-04
description: "Kuvaus"
tags: [react, obsidian]
cover: /blog/x.png
draft: false
---

Sisältö **tähän**.
`

describe('parsePost', () => {
  it('parses all frontmatter fields and body', () => {
    const post = parsePost(RAW, 'tervetuloa.md')
    expect(post).not.toBeNull()
    expect(post!.slug).toBe('tervetuloa')
    expect(post!.title).toBe('Tervetuloa')
    expect(post!.date).toBe('2026-06-04')
    expect(post!.description).toBe('Kuvaus')
    expect(post!.tags).toEqual(['react', 'obsidian'])
    expect(post!.cover).toBe('/blog/x.png')
    expect(post!.draft).toBe(false)
    expect(post!.content).toBe('Sisältö **tähän**.')
  })

  it('defaults tags to [] and draft to false when omitted', () => {
    const raw = `---\ntitle: A\ndate: 2026-01-01\n---\nBody`
    const post = parsePost(raw, 'a.md')
    expect(post!.tags).toEqual([])
    expect(post!.draft).toBe(false)
    expect(post!.description).toBeUndefined()
  })

  it('returns null when frontmatter is missing', () => {
    expect(parsePost('No frontmatter here', 'b.md')).toBeNull()
  })

  it('returns null when title or date is missing', () => {
    expect(parsePost('---\ntitle: Only\n---\nx', 'c.md')).toBeNull()
    expect(parsePost('---\ndate: 2026-01-01\n---\nx', 'd.md')).toBeNull()
  })

  it('returns null on invalid yaml', () => {
    expect(parsePost('---\ntitle: "unterminated\n---\nx', 'e.md')).toBeNull()
  })
})
