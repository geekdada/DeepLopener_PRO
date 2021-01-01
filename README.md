# DeepLopener_PRO

[日本語解説記事](https://t3ahat.hateblo.jp/entry/2020/12/05/DeepLopener_PRO)に日本語で詳しくインストール方法や使用方法を書いているので[こちら](https://t3ahat.hateblo.jp/entry/2020/12/05/DeepLopener_PRO)を読んでください．    
[How to install (YouTube) ](https://youtu.be/bD3ATu0IHUs)  
[How to use (YouTube) ](https://youtu.be/fdgrNRY4jDs)  

You can launch DeepL (https://www.deepl.com) through this Google chrome extension and replace the texts that you want to translate with translation results keepking the original style.  
On pdf, this extension displays a frame showing translated sentences.  
**This is a whole page translatable GoogleChrome extension that uses DeepL PRO API!**  
  
# Install from GitHub 
- Move `chrome://extensions`.
- Ensure that the "Developer mode" checkbox in the top right-hand corner is checked.   
- Download `DeepLopener_PRO.zip` from  
  
https://github.com/geekdada/DeepLopener_PRO/raw/main/DeepLopener_PRO.zip
  
- Drag-and-drop `DeepLopener_PRO.zip` to `chrome://extensions`.
  
# Usage  
  
**(1)** 【transition mode】  
Right click on the text you want to translate → Click on `DeepL:selected_text`.   
**(2)** 【layout-oriented replacement mode】  
Click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener_PRO/raw/main/icon24.png) in the right-hand corner and 
move the cursor and right-click to select the text you want to translate or click to cancel to select.   
**(3)** 【text-oriented replacement mode】  
With the text to be translated selected, press `Ctrl+X` (`Command+X` on mac) twice within 1 second or click on the icon ![icno24.png](https://github.com/T3aHat/DeepLopener_PRO/raw/main/icon24.png) that appears after selecting the text.  
**(4)** 【PDF mode】  
On PDF, select the text you want to translate and right-click on the text and click on `PDF-DeepL:selected_text`.   

**(1)【transition mode】**  
![openDeepL.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/openDeepL.gif)  
Move to https://www.deepl.com/translator#ja/en/selected_text  

**(2)【layout-oriented replacement mode】**  
![layout-oriented.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/layout-oriented.gif)  
The selected frame will be translated on layout-oriented replacement mode keeping the original style.  
If you click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener_PRO/raw/main/icon24.png) in the right-hand corner and 
select `Translate this page!`, the whole page contents will be translated like below.  
![pagetranslate.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/pagetranslate.gif)  


**(3)【text-oriented replacement mode】**  
![text-oriented.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/text-oriented.gif)    
The selected text is highlighted in red first. After traslation , it turns yellow.  
Right-click on the translation to display the original text.If you do it again, the letters will be toggled back to translation.  
It is recommended to use this mode separately from the layout-oriented replacement mode because the original layout will be destroyed.  

  
**(4)【PDF mode】**  
![pdfmode.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/pdfmode.gif)  
For sites whose MIME type is `application/pdf` (local PDF files available!), the `transition mode` changes to `PDF mode` and the other modes are disabled.  
You can move the translation frame around freely in Drag-and-Drop, and right-clicking on the translation result frame will remove it.  

# Options  
You can change the language of the translated text by changing this setting.  
To change the setting, please right click the icon ![icon24.png](https://github.com/T3aHat/DeepLopener_PRO/raw/main/icon24.png) in the right-hand corner and select `Options`.   
(Default: Target : `English(American)`)  
![open_options.png](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/open_options.png)  
![options.png](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/options.png)  
**Translation icon**  
When "Enable", ![icon24.png](https://github.com/T3aHat/DeepLopener_PRO/raw/main/icon24.png) will be displayed on the web page.  
(Default:`"Enable"`)  
  
**HoverText**  
![hover.gif](https://github.com/T3aHat/DeepLopener_PRO/blob/main/gif/hover.gif)  
When "Enable", the original text is displayed above the translation (and vice versa) on text-oriented replacement mode.  
(Default:`"Enable"`)  
  
  
# 免責事項(Disclaimer)  
* 本拡張機能は非公式です．問題がある場合は即公開停止するので，連絡してください．また，いかなる場合も，本拡張機能の利用に起因した損害に対して一切の責任と義務を負いません．  
* 特に，ページ翻訳は大量のcharactersを送信する可能性があるので**十分に**注意して実行してください．  
意図しない挙動を起こしても一切責任を取りません．  
DeepL PROを契約する際にAPI使用額上限を低めに設定することを**強く推奨します．**
* 本拡張機能のセキュリティ上の問題によりAPIの秘密鍵が第三者にわたる可能性があります． **使用する場合は必ずソースコードを読んで，リスクを考慮したうえですべて自己責任で使用してください．ソースコードの挙動を理解できない場合は使用しないでください．** 開発者は一切責任を負いません．
* 定期的に身に覚えのないAPI使用履歴がないか[ご利用状況](https://www.deepl.com/pro-account.html?page=category_usage)を確認してください．
* 開発者はド素人なので，特にAPI鍵の保存方法に関するPullRequestを歓迎します!