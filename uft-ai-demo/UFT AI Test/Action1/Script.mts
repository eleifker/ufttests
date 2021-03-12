AIUtil.SetContext Browser("creationtime:=0")
AIUtil("profile").Click
AIUtil("input", "Username").Type "aidemo"
AIUtil("input", "Password").Type "AIdemo1"
AIUtil("button", "LOGIN").Click



AIUtil("search").Search "17t"
AIUtil.FindTextBlock("HP ENVY - 17t Touch", micFromBottom, 1).Click
AIUtil("button", "ADD TO CART").Click
AIUtil("shopping_cart").Click
AIUtil.REgisterCustomClass"Safepay","C:\aos_mockups\Safepay.png"
AIUtil("button", "CH ECKOUT ($849.99)").Click

