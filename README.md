# ddc-yank

This plugin is yank source of ddc.vim

## Configuration
```vim
call ddc#custom#patch_global('sources', ['yank'])
call ddc#custom#patch_global('sourceOptions', {
      \ 'yank': {'mark': 'Y'},
      \ })
```
