import { Button, Grid, Input, Link, Text,  } from "@geist-ui/react";
import NextLink from "next/link";
import { AlignJustify as MenuIcon } from '@geist-ui/react-icons'
import { CSSProperties } from "react";

const NavBarBtnStyle: CSSProperties = {
    margin: "4px",
    fontWeight: 500
};

export function Header() {
    return <div className="header" style={{ padding: '10px 12.5%' }}>
        <Grid.Container style={{ marginBottom: '10px', alignItems: "center" }} justify="center">
            <Grid xs={16} sm={4}>
                <Text h1 size={28}>NFT Market</Text>
            </Grid>
            <Grid xs={0} sm={10} justify="flex-start">
                <NextLink href="/">
                    <Link style={NavBarBtnStyle}>NFTS</Link>
                </NextLink>
                <NextLink href="/create">
                    <Link style={NavBarBtnStyle}>CREATE NFT</Link>
                </NextLink>
            </Grid>
            <Grid xs={0} sm={10} justify="flex-end">
                <Input size="medium" placeholder="Search NFTs" />
                <a href={process.env.NEXT_PUBLIC_MATATAKI_OAUTH_URL}>
                    <Button size="small" type="secondary">
                        Sign In
                    </Button>
                </a>
            </Grid>
            <Grid xs={8} sm={0}>
                <Button auto size="small"><MenuIcon /></Button>
            </Grid>
        </Grid.Container>
    </div>
}