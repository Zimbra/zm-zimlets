//Zimlet Class
function com_zimbra_zss_HandlerObject() {
	
}

//Make Zimlet class a subclass of ZmZimletBase class - this is what makes a JS class a Zimlet
com_zimbra_zss_HandlerObject.prototype = new ZmZimletBase();
com_zimbra_zss_HandlerObject.prototype.constructor = com_zimbra_zss_HandlerObject;


var ZssZimlet = com_zimbra_zss_HandlerObject;

ZssZimlet.prototype.icons = {
	doc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACABJREFUeNrsm1lPFUsQx5tFRVAQVFyBKO5brrg9offBF594ITExfADj2/0k9wv4TQgaiA9EfTDuG4u44Aq4r6j8OrdOip6eOXNmGq6E00nlzJnp09P/6qp/VdfMqfj165dZzK3SLPJWVkBZAWUFLO5WHXdh48aN/858/MVx1kgRIsIkjZF2/Jl+1169evVPSQoA/O7du/9euXJl4WYVFRWFm7o31+d1vzQTj+vru5d7znetFCUlKcAAvqmpKTP4NBNKC57PtOCT+qVWgP7xrl27rMQBENClrnwW5aQ99/LlS3PhwoV8FiCgAN/V1bWgyO3mzZumr6+vqOITo0CxFV0ILbcFuIP8+PFjlj+mNd9Sv2f5XVVVlamrq0ucf0kK8P34w4cP5tu3b7MG//nzZ4Sk5HyxPmkk7Rj19fVm7969JVlAZRbz+RPBp7Xg3JlgmknV1NRYc5xP8HGKyMUBSX7HpJYvX24mJycLE9QTbWtrs67y7t076zbfv3+35/nNly9fZk26srLSNDQ0mOfPn9vva9assePq6y5Q+hPqXIWUmimm4gCigQueT0Ax6ampKTM9PV0QJowCli5dasEgnz59Mp8/fzaXLl0yT548KfRlLD67u7sLIB48eGBjuFwX0d9PnTplVq1aVdQNcrlAXMYlwgrX1tbOAo+wwh8/fpw1Fv1Wr17tBY+8ePFi1v2SwHPc3Nwc6zbBSDDOAvREWWVXAcjExERkrKdPn3rBczyzWbFjaRKNA9/Y2Giqq6uLKiA3CfrSW9cXibsueCb65s2byHiPHz/2gkfGx8fNpk2bbCjTCnDB8zmzSbPjY2W4H3yBAl+/fh2WBH2ZoNY2k3FdQCbKhHz5uQ88gnVAbAiAtmzZYgGiNFcRQpj69xJ94iw1eB4gcf7r16/Wt92V9SlgbGzMC17OjYyM2H6HDx82Z8+eNZ2dnRHwogAXPH2CckDS1lcnORAhbOyu7Nu3by3zS/hj9fkeB16sQDeigdsfN8H8feBlXqWEwSCJkHYDvWL4JBEBP8XHk8AjDx8+jFiM7o/s3LnTHD9+3PLAkiVLCuD5DFoSK6YEnfSIAjR4Pp89e2atQwgwCTxCiJRGzuAqgP4ogCINcuTIEXP//n3rOsPDwxELSGMJ1XnByy4MJWD2bmxnc0LIGh0dTQTPdywG4GSLAPOFQinMSNuxY4eV9+/fe3kndx6QlAjp78RmFxxsTlbIFlpSZn192bJlEZITK9CrL9dbWlqsouPKd1u3bg3PAXFhUB+vWLGCKnKEB/B7VlNClgt+3bp1kTjPyrOad+/ejSino6Mjk7sGD4OuJUia60ty8P1Hjx5FzH79+vV2xdxVvnfvnjVlFKD7cx+ILxTwXBygBf9mNTdv3uz1b1YfMnR9HvAbNmyIrDJc4YZL4Z09e/YEL4tVZh1Qr740bQUigB8aGooQGgrYtm1bpD/Z3/Xr1yPgIb+BgQE7FrnHvNQEkzhAJob/S8MKSGY00KtXr3rZHPD/PYGKEB5ANXjOtba2WnfCQog63Gvfvn1W6XmeHFWXqj0Bz6RgdzYv0tiiFgt1Yv7SyOwkRMp1CigaPEJNgeIK50m/4Yrbt2/bfGD//v2mvb3duuKcPxxlAgB3wdMIU8XASzqr47h73QXP8dq1a73zgTB7e3vN+fPnI5lkMAVoS9CTYlOiG7mApKdJ+3kiAH5OmOS4GPijR49aq8HsXXaXY6yCBZhzEtShTh6c6kYpLAk8n7A/E8b0aWxj48AjZJO414kTJ2zp7ODBg5Z7dD5CH58LBMkE3QGZHJOmguM2VjQJPFaiH66wUSK/jwOPQHbSAE5CdObMGVsXFD5xnwfM2YORpNWnUciIA49s377dxnn9oAWGv3z5shc8maSb4up7IZCjy0dBH4zoQWRimpTY8xObOS8psQ88AunB2LC6jItL+MDL6t+5cycx9mcFn/rxuGsBbHDkGZxMFLNmZckMAaTrf1ogKqwHYeXZMTKer6+ETHKJwcFBqzjyB5QcqmXKA4i9cakxBRAmqLe/IpAUoAs3n1GWhETI080YETZMRAuaxH6yzwMHDti9QZrYH5wDfCans8NDhw5FHlogSVnb6dOnbVHD/Y3ONOUcu8X+/n5z8eJFc+7cuUQlBE+FAYj/6kfSmDAVZKn/MWlYme+4BubNMX3Z78Mf7qSPHTtmxa0iYxVxsZ+8IA58kN2gjwdYWUzXLZ8zEYSKDisEYNdFiP2Sz6NEzJuwGNeI/QgWRYGU5ImwKc0X+oLXBF0t6tX3NcIWwspT4mLCHLvKwK+xBjJHeIHV5NjXyDcAi7C7hAdQSNbtcS4SjIv/kYFnrISkCHOnVkhdAMtwK0pEjlu3btnVhRAhw7i8X3aPyMmTJ1MnbvrRXu4wWGrD76WKC1i2y6yir7RG5Qifx4LIFwiBvmwzSwk/mAXkaYQvMkGyN1wALtBWIfcjO7xy5YqN/SgB00+KIHPKAXOhCNyDhAjhKQ8FEWr7vqe9EvshS2I/Csmy7w9GgqEbK4uwIZIHHFL40AKhsu/HlXp6euanJDaf7wjiHsL0hEqIEa5w4zrp8LxxwP/VxD3gAlxAvy9ALSBURfiPcIGkRkZJEpQ3CuQmwRs3bhR9UzzNjbO8yJTlmT/X2WUGI0H8kZePfX5Vymvqpb7jn/V122LjZ94LLETwmRXA30xCg097Ls3v495fimnX4i5UlP85ushbWQFlBZQVsLjbbwEGAEn6ENiuvfkmAAAAAElFTkSuQmCC",
	generic: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAtZJREFUeNrsm0vL2kAUhk+iiYIXxFprxYqggigtHyKC4A+wpdCfIggiIipu6n8pbnqxSzcuLMIHuujGlSsRXVrx0qqdCQRCKZSkThwzc0AQUTLz5H3POZMZhcvlAiyHCIwHB8A6ALueL8disQ82m81zOBxAEARTBohzlCRJv1C83263I1EUlc/U6/9tHOv1mgwAv9//LpfLyZlMBk6nkzl3yG6H2WwG4/G4sFgs3iII3zCEmyhgv9//SKfT/nK5bKpMN5sNdDqdJ4PB4NNqtcIQxkiJ5gPAcjufz8r74/FoGgCPxwOtVgur7ulwOPy8XC7fIAiP14CgS0tYemZ5XxsYttfrhXa7DcViMRgOh/tutzt7DRveBQAVgs/nU5RQKBSeRSKRLwjCw/9CEPUmpGsmICMQUCKGZrMJ+Xz+OapKWAmvUIVQKoP6IgYAe+5WCtBCCAQC0Gg0IJvNhuPxeB8p46Usy+B0OpUXsSR4awVoIQSDQajX69DtdiNo8v3dbvca2eG73hukWwE0AFAhhEIhqNVqkEqlXqBK8RWNL22KBWhZQWIIqCJAtVqFZDIZRVboYwhEqwAtCtBCQBUBKpUKJBKJGLJGz5Jl8F8QotEolEolnKcixADQOPk/kzSKn8wuh43kJruRixhpOGgFwJ8IkSZMuwq4BawmaeIK0KqAOQXQOnHTFKD1P20gjI7LboSulQDwjRFuAcYBiEYuxKsAtwAvg9QCULfumOwEiSuA5tWgeveZtgDeJyQKABNWKfMqwGISvIeHIbwPYDUHaCsBfx5AuhGidYuMuALuoQwSB0B7J0g8BzDdBxjptS2XA5i3gNWSILeAlSzAF0MsrwVMeyaIg+bTYsw3QsQtgI/Lulwu9UweNYHHJEkSWQWgSbvn8zn0ej3AZ/RpCofDAdPpVBkjMQCyLH+cTCae0WhEpf+xAhCIjZ7fCPy/w4wHB8A6gN8CDABjkPyai4yTEAAAAABJRU5ErkJggg==",
	image: "data:image/png;base64,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",
	music: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFhJREFUeNrsW0tIG1EUffn4iUai0agoRFMVQUkVuuhGKBSEgiC4KBTERemqhdJtC4WuRFelqy66EgrddFEKLRTdpKKbgqC4qgQLESESP0yMxoxGe+60E1IbY+Y/ycyFQ8w4vvfOfff3PjouLi6YlcXJLC6WV4BbaQNNTU2GEjg4OLAtwFALMIvAEj34uHUJWVjIzUpUQI4siItkB5xOJ/N4PKyurk78XK8ECyg0swLZPKICamtr9XcBh8OhG9l8yCFrNgUUJEvt1dfXCyTFT5pl0wbBEhXgBYYLzSyRzIeWZPVSgLfAzPaLZL1ebw56k9VDAV+AMSLb0NCQI0o/m4GsHgoIhsNh1tzcrNf4Y4AL6DSNC5CZu92aZNdtYCUPP4DEycnJDMbwvKamxhyVoMvlEqAyWUI8k8mwZDKZA8dxjOd51tfXx0KhkDksgL5TDFCDLBHMJ0zPCvUvo0/tLEAckBSyMOPcjBYjK7NP05TCs8ALpWTLejW4ubnJNjY2Kns5THuMV+0zarX/WKxPe0PEVoCJXEBLsV3AKAsopPliQVAL61DSru0CtgtYvA6wFaC27103GC2VYFuArQCTrAbLKQ3qGgMsXwhZPgZYwgXOz88FFBJ6rkA5fmACGAV68553FuuzEiyAjtpmgEdut9tDhy50LSf/dLi6urpiY0A/MO9yuYJdXV2sra3tyu3vskiDEgdJx10RzHT74OAgE09+1I4vusYAie7xFqYtkK+qqpLt4+UaAyjIjdNxF50zaplVzBoDRsjkGxsbNU+pshWAaEwBagQIAHQyuUqpSiUXaKd7BVqZvWwF+P1+OvZ9DDwjM6VURAMlH6VUlE6nhSidzWaV1gHbZPpXtSNBoqopAORplj8D4UAgwFpbW9lVZ/LFCqES5Xsmk8nifaXn7F9VUQAKDx+RB+EwBSbxuotUE5XgArHDw8M5WMAjBbfQ6PbIe8UKAHmahY8oRsLd3d3CrMv1TSkBjef5J3t7eyFY3l0ZXfHAZCQS4RUrAIMexyyMBoNBwc+VBCaJawF+a2vrAWLBPOLMsIRuOOD+4uLiUikvl7ItPkG3vOjCohjh5UJqSsP7iVgsdvv4+Pgl/j5xTfspYBq4AfILamaBXlKAUf9ac3Z2xkej0emWlpbXSL0jsAhKv2FgAKA08ZP9uTD1aXl5eV/1NAjinEql6L6S5XAikUgjJiwgAC9QHBKxtrameR2wglm4p4ICvqEdRQ3QGI6OjgSoJc4SLGAOBQ4vpjCZWALWU6kUU9jOf9BcAclkMspx3KxovjKQBp4ikBl6GUpJFmC7u7uv4H/vZET+NDCJgmZ1Z2eHmVEcUsyop6dnyufzvfm7P3dt7AAekunH43FG5q+FoGLUTwEkHR0dHqwFprDoGcPXO4Av79e/ACpAPlDQI5OnmafrrFqJ7gq4LENDQ//s052enjK6DEkDI7/XWgxXABVJRorhCih3sS9KWl0BvwUYAFob07J+yU55AAAAAElFTkSuQmCC",
	pdf: "data:image/png;base64,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",
	ppt: "data:image/png;base64,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",
	rar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABJ1JREFUeNrsW1sobFEY/odxp4QmTI1Gw5BLHlyezoMkwgOh6DxKSbxQigek8GSieJCUBw88Kg8UNZpS6hSKKVFHU4fcImI4LnP2vzp7QodjrzV77T22v1az/9pr7bW+/f23tfboPB4PaFkCQOOieQD0rAMMDg4quoDOzk5+AAiL/aHQOt1C+97e3u7y9cA6KU5QAMBTWFgIer2e6+pdLhfs7Ozg4r+9BiE4OJivCWRkZEBISAhXALKysiAwMNDkdDodQ0ND33zJBElOUKfTKcJ/fG5paSmkpaWZhGuHzWYzKwJAQIByQQNBKCsrA6vVahLmYR8eHjZzBwBtn4UFj4+PsLm56W17e3tUTEhNTTUJc7GPjo6auQIg2CHTw66vr6GkpAQqKytJowlhOAcEITk52SRc20dGRsxcGcCMuGBGwhskzWQyUY+BIJjNZmSCY2xszOw3AIgLwMZiTti/uLgYQTQiCOPj41QgSMoDJicnPXV1dRAUFETtA7a3tyE8PJzoh4eHMD09Dfv7+0SvqKiA1tZWyWMuLy/D0dHRL8wTGhoafqrWB2D/7OxssFgspIWFhcHq6irzmEVFRRAfH28Urh1TU1MW1QLwWp6enuDh4QGio6NJE5lBAwJmqAaDAUGwy5YJsgJwe3sLPT09Xj0iIgL6+vogNjaW6EajkT6lFfxTbm4uLC0tGWUDgDUTvL+/h9nZWUhJSSF6ZmYm1NbW+jRZkjpHvlXNX++dlJRErgW79f/9ACmC0aO+vh7S09OJjkWVQFk4Pj4mOjIjLy9PvQCw7h+GhoZCf3+/V8eQ2NbWRjJElKqqKmYApM5RryT9bm5uMH5DQUEB0RMSErjP4WtPkKcJXF1dEc8vCtJ9Y2PDpwtSvQlgvMbMDQWzQU0x4PU4chzKyMoA1gljqjs3NwdRUVFEx/DX0dFBogFKeXk5NDc3f14TwFT6uQ84OzsDu93uTYxoq0y/M4HnpSzWByIjME9gfftym8Bv4Yd6Ix4X29vb+6IY6u7uhri4OOZiiJcPcLMAgMXQzMzMi2KopqZGO05QrNgSExPJtfjmNQOAWAyJDMBiaHFxEU5PT4mOG6WqrgV8UQwNDAx49a2tLWhpaSE1AUp1dbX6AfBlJMCFn5ycQE5ODtENBoPqo4AsNuvLzNCvAMjPzwen06moEwxQmgFKRwHNAyC7CTQ1NXlPfqQKRgg8LfJrAHZ3d8nhB2uer4oogCc5NJPChAePwWg2T6SK1DlyiQLYDyeGHzQ1Nja+eR8mRisrK0zPU50JYB8se7HhoQh+IPGWXFxckMQoJiaGiXGyRQGaCYn9xPaeuN1usnH6kXvfY5rqfAD2Qwbc3d3B/Pw8nJ+f//PetbU17720z1MtANjwDdtsNjg4OHjz/sjISGqmcQGAxg+8prS4H/C/RUh9lqpNgIdDU6UJ0L6ZTwUALwbIbgK0iRBPE1BdKjwxMUH60XxeQ/MFieoYYLVauZbCqswEeYrUOX7tCH0BoHEAJDvB9fV1RY6xPyKXl5eyfx+wsbCwEAmfSHSstO7q6lJ0Ac+P2hQBwN/l68/TWgfgjwADAJzcr4qP0+CSAAAAAElFTkSuQmCC",
	text: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAxdJREFUeNrsm79rIlEQx2eNv5BDCUQRhCW7/sgStVIbIUUwgZAiwfr+jG2if4CplASSIoVgIf4NSaW42B14TQQTCCKBpEhlkSMX0dsXEI7DLfbcfe+5bweErcaZD9+ZefNWufl8DiybAxg35gE4V3Vwfn5ONIFSqYQPgJrsD0J5/lI/32VZHhvtmNPTBFUA8/39fXA6nVizH4/HMBwOUfJ7/0Jwu914SyCZTILH48EKIJ1Ow8bGBj8YDJRqtbpnpBJ0NUGO44joH33v0dERSJLEq89KrVYTiABwOMgNDQTh+PgYdnZ2eDWOzsXFhYAdAKp9Uir4WwmJRIJXY+lcXV0JWAGodUh8bqMYEARRFHn1uXN5eSlgVQAVpze1FBEEQRCQEpTr62uBKQALCIeHh8DzfARBuLm5ESzfA5aVw8HBAURUQxDq9bpg+R6wLKZCoQDhcDiiPiuNRiPGFIBFXOiEGgqFEIQOcwAW5ZnNZlGMEcudBPXEpzdGQ9q6oijw8vKCNVmXywXFYpH8fQCyu7s7uL+/xwoALWTYAWitztvb2xAMBrHLXU+Mpipgd3cXptMprKMZAiCfz8O6msOIEqDJiJRAr9eD19dX7FPg5OSEjibY7Xbh8fER+xRYBsBUBWg5j8ViEI/HsQKYzWb0lIAoitTXuqkKyGQy1DRAvWD0ToHfTE8B1Tl6Q+NeNgVI7AKnp6d0NMF2uw0PDw9YAXi9XnoARKPRr32ABqkTAZDL5TTHktV6wNIvQOcAVqYA27uAlvNWq0XkKHx2dkYHgOfnZ3h7e8M+BqlRwNbWFvh8PqwAiNwIaTlHFyKfn5/sApAkiY0pQMusNzJGQxTQbDYNOQrLsgyBQGD9xuDT0xOMRqOVAby/v9MNQEtem5ubX/uAWY1NT/KmloCWc/Rm9uPjY2UAfr+f7h6g5TyVSq1tE9Q9BWjeB/6nBJgfgzYAKwEwvQSseB9gl4CVFGAvQ6wrwPQeYAOwb4Xn0O/3NS8kSdtkMjH99wE/b29vv4GFjFtV1uVymWgClUqFLIB1N/vP06wD+CPAABlYodN5imEZAAAAAElFTkSuQmCC",
	video: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABP9JREFUeNrsW8lLm0EUn2g0RmPcNVoNLkElmCqKgaJS6EkQesrBe0Ev/Rs8eO21F4UeCz14Kp576kkqqMGKuKCCuIFiXKIYTd+bzqSfn3GpeeM37efAY8b5dJY3b/nNe6MjmUwyO5csZvNiewY4Mx2gpKTE0g0cHBxk9PeOx9oA2HgIqveaHORHYET0qSXA73a7h8rLy3VgwFegJ2cAy8nJYWVlZfa1AQ6Hg5MtGSA3n5WVZW8GZGdn3/Yry0DfiNb5BiigHQPw9J3OW4eYOjs7G47FYhTr/Oz1egN5eXnaMuAYaFF8cgMFsQEMYGtrayQLbW5uZh6P5yc046ILJaJIFwbMXF5e9sXjfG0h6J/Lz8/n36mMpJhr8PT0NHp1dYVdkyARA3dI4NPYALmAk5MTNjMzw9sFBQWsu7ub2wcqBuBYONfi4iKfi3M6FMrYDZPZAONmZb8KBhilSvZZhgNwMcIL9EKdNDIH++/wEI9iANCckaEUc5DhgNLSUtbf368MKMm5enp69LoN3rVBSpSoCnU+xwOIxtkWNzKuDUARReudANoXbdQ3v+UMEPGE5fPz8+G9vT3uneCWGKmqqmKU8UYcC2h0Z2cnenFxwXEAXMX9maJDKglgAFDY/Pw8bxcWFjJkgIqysrLCjo6OeLuzs5PpwgAf0JBov1Cosqhar2RAxnIbIMSS4/Lc3Nyx2tpa3u9yuYzfKFVgpLKykhUVFV2bRwsVQOwfDAaVW+2mpiY9vIDk/H0nQC0FWrnB+8RcgQpoiwMw+vPBYARHFGnAKNCmaGNIPqQLDtgGNzi+vr7OcQAYp5HGxkYVEjCxuroaBcyBXW/r6upCHo9HDxXARW1u/j4cXFRDQ0MAvg0R7T8g59rd3WXHx8e8E3MSGHvQwQjiAsdEu1QsNux2u8M1NTUkHICxuBsE2hfzhCjsApUE+DBL1Nra+ntQp5P3IyJsaWmhVINIfX09SyQSqciT5ThALgCzRNXV1UpdFpaKigpST6PUDf7X1+EHAKEpoE9E63wHFNYyHiAY8B2oT3Shb55DbAC3tvGtrS2Kdb4G9QqDTXnJ/mSBJ4EGtEGCh4eHbHZ2NmWcurq6+BWZiAH8AoTudXp6OhUWb2tr47FIy1QASSQprjFD9lPaiHRj4s9yfqtVoAPqH9JlqzCQYrwvzJAa0wkHeOA63NXe3s77MXytiAFBzBHKUxfgSA8cgJs2wlIV7hHHxE1rgQPMNiBdkTpLUSj0XaUKpE2PK1ABfdLjJhHk6XF8D8BEetwsqkRMGIzH49fS45blBs0qgFfUhYUF3sb4IPpoFSqwtLTE8QUWNIjFxcXWMQAXBCd/Q9+xxn5qBuCYZhwg57dMBYQE9EKdNDOH0miJ8eaMDLUUCJlVAMW+o6PjhgegRoLm+IKlSPAhbpBYAvS6Dt/HABUSoB0OEItKmx5XIAF6pccNJ7ycSCSGRdY2BL454vV6VeCA0VgsFhWWfxKux34MxWmhAgiCZFgcU9Z4d1eBAzAsLgAX8/v91j2SMqmAD+pUetx4d6eEwjBmBOpUetxyN2ioA3ASYzJtLcLiYUOuINMSlulxlCz5KEKG37UIiaEuGl+FQH/A5XIFfD4fiQTItwDml6GWxwPuEkE8IUyOUHoC7XCAbfMCKiM//woDNoDGNdnHxmP/0JHpCVK/2fnbgs/mMimO53+etnmxPQN+CTAABv9p9QhFTnIAAAAASUVORK5CYII=",
	xls: "data:image/png;base64,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",
	zip: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABJ1JREFUeNrsW1sobFEY/odxp4QmTI1Gw5BLHlyezoMkwgOh6DxKSbxQigek8GSieJCUBw88Kg8UNZpS6hSKKVFHU4fcImI4LnP2vzp7QodjrzV77T22v1az/9pr7bW+/f23tfboPB4PaFkCQOOieQD0rAMMDg4quoDOzk5+AAiL/aHQOt1C+97e3u7y9cA6KU5QAMBTWFgIer2e6+pdLhfs7Ozg4r+9BiE4OJivCWRkZEBISAhXALKysiAwMNDkdDodQ0ND33zJBElOUKfTKcJ/fG5paSmkpaWZhGuHzWYzKwJAQIByQQNBKCsrA6vVahLmYR8eHjZzBwBtn4UFj4+PsLm56W17e3tUTEhNTTUJc7GPjo6auQIg2CHTw66vr6GkpAQqKytJowlhOAcEITk52SRc20dGRsxcGcCMuGBGwhskzWQyUY+BIJjNZmSCY2xszOw3AIgLwMZiTti/uLgYQTQiCOPj41QgSMoDJicnPXV1dRAUFETtA7a3tyE8PJzoh4eHMD09Dfv7+0SvqKiA1tZWyWMuLy/D0dHRL8wTGhoafqrWB2D/7OxssFgspIWFhcHq6irzmEVFRRAfH28Urh1TU1MW1QLwWp6enuDh4QGio6NJE5lBAwJmqAaDAUGwy5YJsgJwe3sLPT09Xj0iIgL6+vogNjaW6EajkT6lFfxTbm4uLC0tGWUDgDUTvL+/h9nZWUhJSSF6ZmYm1NbW+jRZkjpHvlXNX++dlJRErgW79f/9ACmC0aO+vh7S09OJjkWVQFk4Pj4mOjIjLy9PvQCw7h+GhoZCf3+/V8eQ2NbWRjJElKqqKmYApM5RryT9bm5uMH5DQUEB0RMSErjP4WtPkKcJXF1dEc8vCtJ9Y2PDpwtSvQlgvMbMDQWzQU0x4PU4chzKyMoA1gljqjs3NwdRUVFEx/DX0dFBogFKeXk5NDc3f14TwFT6uQ84OzsDu93uTYxoq0y/M4HnpSzWByIjME9gfftym8Bv4Yd6Ix4X29vb+6IY6u7uhri4OOZiiJcPcLMAgMXQzMzMi2KopqZGO05QrNgSExPJtfjmNQOAWAyJDMBiaHFxEU5PT4mOG6WqrgV8UQwNDAx49a2tLWhpaSE1AUp1dbX6AfBlJMCFn5ycQE5ODtENBoPqo4AsNuvLzNCvAMjPzwen06moEwxQmgFKRwHNAyC7CTQ1NXlPfqQKRgg8LfJrAHZ3d8nhB2uer4oogCc5NJPChAePwWg2T6SK1DlyiQLYDyeGHzQ1Nja+eR8mRisrK0zPU50JYB8se7HhoQh+IPGWXFxckMQoJiaGiXGyRQGaCYn9xPaeuN1usnH6kXvfY5rqfAD2Qwbc3d3B/Pw8nJ+f//PetbU17720z1MtANjwDdtsNjg4OHjz/sjISGqmcQGAxg+8prS4H/C/RUh9lqpNgIdDU6UJ0L6ZTwUALwbIbgK0iRBPE1BdKjwxMUH60XxeQ/MFieoYYLVauZbCqswEeYrUOX7tCH0BoHEAJDvB9fV1RY6xPyKXl5eyfx+wsbCwEAmfSHSstO7q6lJ0Ac+P2hQBwN/l68/TWgfgjwADAJzcr4qP0+CSAAAAAElFTkSuQmCC"
};

ZssZimlet.prototype.getFileTypeIcon = function(file){
	var img = '';
	var ext = file.split('.').pop().toLowerCase();
	switch (ext) {
		// Final Draft file types...
		case 'fdx':
			img = 'fdx.png';
			break;

		// Document file types...
		case 'doc':
		case 'docx':
		case 'dot':
		case 'htm':
		case 'html':
		case 'odt':
		case 'pages':
		case 'wpd':
		case 'wps':
		case 'xml':
			img = 'doc';
			break;

		 // Presentation file types...
		case 'odp':
		case 'pps':
		case 'ppsx':
		case 'ppt':
		case 'pptx':
			img = 'ppt';
			break;

		// Spreadsheet file types...
		case 'ods':
		case 'xls':
		case 'xlsx':
		case 'xlr':
			img = 'xls';
			break;

		// PDF-based file types...
		case 'pdf':
			img = 'pdf';
			break;

		// Image file types...
		case '3dm':
		case 'ai':
		case 'bmp':
		case 'drw':
		case 'eps':
		case 'gif':
		case 'jpg':
		case 'jpeg':
		case 'max':
		case 'odg':
		case 'png':
		case 'ps':
		case 'psd':
		case 'pspimage':
		case 'svg':
		case 'thm':
		case 'tif':
		case 'tiff':
		case 'wmf':
		case 'yuv':
			img = 'image';
			break;

		// Archive file types...
		case 'rar':
			img = 'rar';
			break;

		case '7z':
		case 'deb':
		case 'gz':
		case 'pkg':
		case 'rpm':
		case 'sit':
		case 'sitx':
		case 'tar':
		case 'zip':
		case 'zipx':
			img = 'zip';
			break;

		// Text file types...
		case 'csv':
		case 'dat':
		case 'log':
		case 'rtf':
		case 'txt':
			img = 'text';
			break;

		// Audio file types...
		case 'aif':
		case 'aifc':
		case 'aiff':
		case 'au':
		case 'iff':
		case 'm3u':
		case 'm4a':
		case 'm4p':
		case 'mid':
		case 'midi':
		case 'mp3':
		case 'mpa':
		case 'ra':
		case 'wav':
		case 'wma':
			img = 'music';
			break;

		// Video file types...
		case '3g2':
		case '3gp':
		case 'asf':
		case 'asx':
		case 'avi':
		case 'flv':
		case 'mov':
		case 'mpeg':
		case 'mpg':
		case 'mp4':
		case 'm4v':
		case 'rm':
		case 'swf':
		case 'vob':
		case 'wmv':
			img = 'video';
			break;

		// Executable file types...
		case 'app':
		case 'bat':
		case 'cgi':
		case 'com':
		case 'dll':
		case 'exe':
		case 'gadget':
		case 'jar':
		case 'js':
		case 'pif':
		case 'vb':
		case 'wsf':
			//img = 'executable.png';  // no icon
			break;

		default:
			img = "generic";
			break;
	}
	return this.icons[img];
};
ZssZimlet.prototype.init = function(){
	this.vaultPath = this.getUserProperty("zss_url");
	
	this.messages = {
		menuItemTxt: this.getMessage('menuItem'),
		noFilesFound: this.getMessage('noFilesFound'),
		fetchingContentMsg: this.getMessage('fetchingContent'),
		addFilesAsSecureLink: this.getMessage('addFileAsSecureLink'),
		attachingFileNotification : this.getMessage('attachingFileNotification'),
		selectFilesDialogTitle : this.getMessage('selectFilesDialogTitle'),
		chooseFolderDialogTitle : this.getMessage('chooseFolderDialogTitle'),
		fileSavedToVault: this.getMessage('fileSavedToVault'),
		saveToVaultLink: this.getMessage('saveToVaultLink'),
		refreshFolderBtnText: this.getMessage('refreshFolderBtnText')
	};
	

	// Add Save Attachment to Vault options in email
	if (appCtxt.get(ZmSetting.MAIL_ENABLED)) {
		AjxPackage.require({name:"MailCore", callback:new AjxCallback(this, this.addAttachmentHandler)});
	}
}

/*
	Add Zimbra Sync and Share option to attach menu
*/
ZssZimlet.prototype.initializeAttachPopup =
function(menu, controller) {
	var mi = controller._createAttachMenuItem(menu,this.messages.menuItemTxt,
			new AjxListener(this, this.showVaultFileChooser));
};




/*
	ADD VAULT FILE AS AN ATTACHMENT
*/

// code for showing Vault file chooser in a dialog and 
// providing user the ability to select file.
// provide ability to select whether to save vault file as an attachment or a link?
// call -> processSelectedVaultFile
ZssZimlet.prototype.showVaultFileChooser =
function() {
	if(this.dialog){
		this.fileExplorer.clearSelection();
		this.addFilesAsSecureLink.setSelected(true);
		this.dialog.popup();
		return;
	}	

	this.dialogView = new DwtComposite(this.getShell());
	this.dialogView.setSize(560, 320); //set width and height
	this.dialogView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	
	
	this.dialog = this._createDialog({
							title: this.messages.selectFilesDialogTitle,
							view:this.dialogView, 	
							standardButtons:[
								DwtDialog.OK_BUTTON, 
								DwtDialog.CANCEL_BUTTON
							]
						});

	this.dialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._processSelectedVaultFile));

	if(!this.fileExplorer){
		this.fileExplorer = new com_zimbra_zss_Explorer({
			rootContainer : this.dialogView,
			vaultPath: this.vaultPath,
			dialog: this.dialog,
			noFilesMsg: this.messages.noFilesFound,
			fetchingContentMsg: this.messages.fetchingContentMsg,
			refreshFolderBtnText: this.messages.refreshFolderBtnText

		});
	}
	
	this.addFilesAsSecureLink = new DwtCheckbox({
		parent: this.dialogView,
		style: DwtCheckbox.TEXT_RIGHT,
		name: 'zss_secure_link',
		checked: true,
		id: Dwt.getNextId()
	});
	this.addFilesAsSecureLink.setText(this.messages.addFilesAsSecureLink);
	
	//show the dialog
	this.dialog.popup();
};

// Get the info of the file selected by the user 
// addFileAsAttachment == true? (addFilesAsAttachment)
// else add the link to the message. (addFilesAsLinkInMsg)
ZssZimlet.prototype._processSelectedVaultFile =
function() {
	this.dialog.popdown();
	var selectedFiles = this.fileExplorer.getSelection();
	if( selectedFiles.length ) {
		var addFilesAsSecureLink = this.addFilesAsSecureLink.isSelected();
		
		var insertAsAttachment = false;
		if(insertAsAttachment) {
			this.addFilesAsAttachment(selectedFiles);
		}
		else {
			this.addFilesAsLinkInMsg(selectedFiles, addFilesAsSecureLink);
		}
	}
};

// add the file path as a link
ZssZimlet.prototype.addFilesAsLinkInMsg =
function(files, addFilesAsSecureLink) {
	var self = this;
	var view = appCtxt.getCurrentView();
	var editor = view.getHtmlEditor();
	var editorContent =  editor.getContent();

	var isHtml = view && view.getComposeMode() === "text/html";
	if (isHtml) {
		var ed = editor.getEditor();
		for(var i = 0, len = files.length; i < len; i++) {
			var div = generateHTML(files[i]);
			//tinymce modifies the source when using mceInsertContent
			ed.execCommand('mceInsertRawHTML', false, div, {skip_undo : 1});
		}
	} else {
		for(var i = 0, len = files.length; i < len; i++) {
			view.getHtmlEditor().setContent(editorContent + "\n" + files[i].name + " : " + files[i].path + "\n");
		}
	}	

	this.addGeneratedLinksToMsgMetadata(files, addFilesAsSecureLink);
	
	function generateHTML(file){
		var thumbnail = file.content.file.thumbnail.uri;
		var fileName = file.content.file.name;
		var filePath = file.content.file.content.uri;
		var fileIcon = self.getFileTypeIcon(file.content.file.name);

		var div = '<div style="background-color:rgb(245, 245, 245); padding:10px 14px; margin-right:10px; color:rgb(34, 34, 34);display:inline-block;margin-left:10px; '; 
			div+='font-family:arial; font-style:normal; font-weight:bold; font-size:13px; cursor:default; border:1px solid rgb(221, 221, 221); float:left;text-align: center;">';
			div+='<a href="' + filePath + '/inline/" target="_blank"><img style="margin-bottom:7px; border:none;" height="64" src="' + fileIcon + '"></a>';
			div+='<div dir="ltr" title="' + fileName + '" style="color:rgb(17, 85, 204); text-decoration:initial; vertical-align:bottom;">';
			div+='<a href="' + filePath + '/inline/" target="_blank" style=" display:inline-block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-decoration:none; text-align:center; cursor:pointer;padding:1px 0; border:none; max-width:200px;">' + fileName + '</div></a>';
			div+='</div><div style="clear:both"><br/></div>';

		return div;
	}
};

//save metadata info about the links to message draft
ZssZimlet.prototype.addGeneratedLinksToMsgMetadata = 
function(files, addFilesAsSecureLink) {
	//hang an object off of this view so that when a draft is saved or the message is sent, we can add ZSS URLs to custom mime headers
	var view = appCtxt.getCurrentView();
	view.__needToAddZSSHeaders = true;
	if(!view.__zss_metadata) {
		view.__zss_metadata = {secureFiles:[],publicFiles:[]};
	}
	for(var i = 0, len = files.length; i < len; i++) {
		if(files[i] && files[i].path && files[i].content && files[i].content.file && files[i].content.file.name) {
			if( addFilesAsSecureLink ) {
				view.__zss_metadata.secureFiles.push(files[i].path);
			} else {
				view.__zss_metadata.publicFiles.push(files[i].path);
			}
		}
	}
}

// send file details to the server to download it and create an attachmentId.
ZssZimlet.prototype.addFilesAsAttachment =
function(selectedFiles) {
	if(selectedFiles.length) {
		//Get the collection of Attachment Requests
		var requests = this._createAttachmentRequests(selectedFiles);
		var jsonObj = {
			BatchRequest: {
				_jsns: "urn:zimbra",
				AttachMezeoFileRequest: requests
			}
		}
	   var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsg)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
		appCtxt.getAppController().setStatusMsg(this.messages.attachingFileNotification, ZmStatusView.LEVEL_INFO);
		appCtxt.getAppController().sendRequest(params);
		
	}
};

// Create Individual Attachment requests and return the array of requests
ZssZimlet.prototype._createAttachmentRequests = 
function (files) {
	var requests = [];

	for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i];
		var AttachMezeoFileRequest = {
			"_jsns" : "urn:zimbraMail",
			attach : { 
				uri: file.path
			}
		};
		
		requests.push(AttachMezeoFileRequest);
	};
	return requests;
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsg =
function(response) {
	response = response.getResponse();

	//To save multiple attachments in a draft we require a comma separated string of attachment ids.
	var attachmentIds = this._getAttachmentIdsFromResponse(response);
	var view = appCtxt.getCurrentView();
	var callback = new AjxCallback(this, this._handleSaveDraftCallback);
	
	// Need to save the msg as draft to add the attachment
	view._controller.saveDraft(ZmComposeController.DRAFT_TYPE_MANUAL, attachmentIds, null, callback, null);
};

// Returns a string of comma separated attachment ids
ZssZimlet.prototype._getAttachmentIdsFromResponse = 
function (response) {
	var attachmentIds = [];
	var attachMezeoFileResponse = response.BatchResponse.AttachMezeoFileResponse;
	for(var i = 0, len = attachMezeoFileResponse.length; i < len; i++) {
		var attachResponse = attachMezeoFileResponse[i];
		attachmentIds.push(attachResponse.attach.aid);
	}
	return attachmentIds.join(",");
}

ZssZimlet.prototype._addGeneratedAttachmentIdsToMsgError =
function(response) {
	// handle server errors if any while creating the attachment using mezeo path.
	appCtxt.getAppController().setStatusMsg(response.msg, ZmStatusView.LEVEL_WARNING);
};






/*
	SAVE ATTACHMENT FROM EMAIL TO VAULT
*/
ZssZimlet.prototype.addAttachmentHandler = function()
{
	this._msgController = AjxDispatcher.run("GetMsgController");
	var viewType = appCtxt.getViewTypeFromId(ZmId.VIEW_MSG);
	this._msgController._initializeView(viewType);

	for (var mimeType in ZmMimeTable._table ) {
		this._msgController._listView[viewType].addAttachmentLinkHandler(mimeType,"Vault",this.addVaultLink);
	}
	
};
ZssZimlet.prototype.addVaultLink = 
function(attachment) {
	var zimletInstance = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
	var html =
			"<a href='#' class='AttLink' style='text-decoration:underline;' " +
					"onClick=\"ZssZimlet.saveAttachmentToVault('" + attachment.mid + "','" + attachment.part + "','" + attachment.label+ "', '" + attachment.ct + "')\">"+
					zimletInstance.messages.saveToVaultLink +
					"</a>";
	
	return html;
};

ZssZimlet.saveAttachmentToVault =
function(attachmentId, part, name) {
	var attachment = {
		id: attachmentId,
		part: part,
		name: name
	}
	var self = appCtxt._zimletMgr.getZimletByName('com_zimbra_zss').handlerObject;
 	
 	if(self.folderChooserDialog){
		self.folderExplorer.clearSelection();
		self.folderChooserDialog.popup();
		return;
	}	

	self.dialogFolderView = new DwtComposite(self.getShell());
	self.dialogFolderView.setSize(560, 320); //set width and height
	self.dialogFolderView.getHtmlElement().style.overflow = "hidden"; //adds scrollbar
	
	
	self.folderChooserDialog = self._createDialog({
							title: self.messages.chooseFolderDialogTitle,
							view:self.dialogFolderView, 	
							standardButtons:[
								DwtDialog.OK_BUTTON, 
								DwtDialog.CANCEL_BUTTON
							]
						});

	self.folderChooserDialog.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(self, self._useSelectedVaultContainer, attachment));

	if(!self.folderExplorer){
		self.folderExplorer = new com_zimbra_zss_Explorer({
			rootContainer : self.dialogFolderView,
			vaultPath: self.vaultPath,
			dialog: self.dialog,
			isFolderExplorer: true,
			noFilesMsg: self.messages.noFilesFound,
			fetchingContentMsg: self.messages.fetchingContentMsg,
			refreshFolderBtnText: self.messages.refreshFolderBtnText
		});
	}
	self.folderChooserDialog.popup();
};

ZssZimlet.prototype._useSelectedVaultContainer =
function(attachment) {
	this.folderChooserDialog.popdown();
	var selectedContainer = this.folderExplorer.getSelection();
	if(selectedContainer.length) {
		// Send the details to the server to save the attachment to the selected vault container.
		var jsonObj = {SaveAttachmentToMezeoRequest: {"_jsns": "urn:zimbraMail"}};
		var request = jsonObj.SaveAttachmentToMezeoRequest;
		
		request.attach = {
							mid: attachment.id,
							part: attachment.part,
							name: attachment.name,
							uri: selectedContainer[0].path
						};

	    var params = {
	        jsonObj: jsonObj,
	        asyncMode: true,
	        callback: (new AjxCallback(this, this._handleSaveAttachmentToVaultResponse)),
	        errorCallback: (new AjxCallback(this, this._addGeneratedAttachmentIdsToMsgError))
	    };
	    appCtxt.getAppController().sendRequest(params);
	}
};

ZssZimlet.prototype._handleSaveAttachmentToVaultResponse =
function(response) {
	response = response.getResponse();
	// make this more robust
	if(response.SaveAttachmentToMezeoResponse.attach.uri) {
		appCtxt.getAppController().setStatusMsg(this.messages.fileSavedToVault, ZmStatusView.LEVEL_INFO);
	}
};
ZssZimlet.prototype._handleSaveAttachmentToVaultError =
function(error) {
	//handle save to vault error
	console.log(error);
};

/**
 * Called by the framework just before the email is sent or saved to drafts.
 * @param {array} customMimeHeaders An array of custom-header objects.
 * 				  Each item in the array MUST be an object that has "name" and "_content" properties.
 */
ZssZimlet.prototype.addCustomMimeHeaders =
function(customMimeHeaders) {
	var view = appCtxt.getCurrentView();
	if(view.__needToAddZSSHeaders) {
		if(!view.__presendHeaderAdded) {
			customMimeHeaders.push({name:"X-Zimbra-Presend", _content:"zss"});
			view.__presendHeaderAdded = true;
		}
		if(view.__zss_metadata.secureFiles) {
			for(var i = 0; i < view.__zss_metadata.secureFiles.length; i++) {
				customMimeHeaders.push({name:"X-ZSS-SecureFile", _content:view.__zss_metadata.secureFiles[i]});
			}
		}
		if(view.__zss_metadata.publicFiles) {
			for(var i = 0; i < view.__zss_metadata.publicFiles.length; i++) {
				customMimeHeaders.push({name:"X-ZSS-PublicFile", _content:view.__zss_metadata.publicFiles[i]});
			}
		}
	}
	//reset
	view.__needToAddZSSHeaders = false;
	view.__zss_metadata = {secureFiles:[],publicFiles:[]};
};